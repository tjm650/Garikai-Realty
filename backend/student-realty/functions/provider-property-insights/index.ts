import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const json = (body: unknown, status = 200) => Response.json(body, { status });
function normalizeZimbabwePhone(v: unknown): string {
  let value = String(v ?? "").trim().replace(/\D/g, "");
  if (!value) return "";
  if (value.startsWith("00")) value = value.slice(2);
  if (value.startsWith("263")) value = value.slice(3);
  else if (value.startsWith("0")) value = value.slice(1);
  if (!/^7\d{8}$/.test(value)) return "";
  return "+263" + value;
}
async function providerByPhone(phone: string) {
  const q = await db.from("providers").select("id,business_name,phone_number,is_active,verified")
    .eq("is_active", true).eq("verified", true);
  if (q.error) throw q.error;
  return (q.data ?? []).find((p: any) => normalizeZimbabwePhone(p.phone_number) !== "" && normalizeZimbabwePhone(p.phone_number) === normalizeZimbabwePhone(phone)) ?? null;
}
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const secret = Deno.env.get("PROVIDER_WEBHOOK_SECRET");
  if (!secret || req.headers.get("x-jeff-provider-secret") !== secret) return json({ error: "unauthorized" }, 401);
  try {
    const body = await req.json();
    const phone = String(body?.phone_number ?? "");
    const command = String(body?.message ?? "").trim();
    if (!phone || !command) return json({ error: "phone_number and message are required" }, 400);
    const account = await providerByPhone(phone);
    if (!account) return json({ handled: false, error: "Verified provider not found" }, 404);
    const lower = command.toLowerCase();
    const selected = lower.match(/^provider_insight_([0-9a-f-]{36})$/i);
    if (selected) {
      const propertyQuery = await db.from("properties")
        .select("id,property_no,name,available_1h_rooms,available_2h_rooms,available_3h_rooms,available_4h_rooms,total_1h_rooms,total_2h_rooms,total_3h_rooms,total_4h_rooms")
        .eq("id", selected[1]).eq("provider_id", account.id).maybeSingle();
      if (propertyQuery.error) throw propertyQuery.error;
      const p = propertyQuery.data;
      if (!p) return json({ handled: true, reply: "That property was not found under your provider account." });

      const harareYear = Number(new Intl.DateTimeFormat("en", { timeZone: "Africa/Harare", year: "numeric" }).format(new Date()));
      const yearStart = new Date(`${harareYear}-01-01T00:00:00+02:00`).toISOString();
      const nextYearStart = new Date(`${harareYear + 1}-01-01T00:00:00+02:00`).toISOString();
      const [bookingQuery, reviewQuery] = await Promise.all([
        db.from("bookings").select("status,created_at")
          .eq("property_id", p.id).eq("provider_id", account.id)
          .gte("created_at", yearStart).lt("created_at", nextYearStart),
        db.from("reviews").select("rating").eq("property_id", p.id)
      ]);
      if (bookingQuery.error) throw bookingQuery.error;
      if (reviewQuery.error) throw reviewQuery.error;
      const bookings = bookingQuery.data ?? [];
      const reviews = reviewQuery.data ?? [];
      const countStatus = (statuses: string[]) => bookings.filter((booking: any) => statuses.includes(String(booking.status ?? "").toLowerCase())).length;
      const averageRating = reviews.length
        ? (reviews.reduce((sum: number, review: any) => sum + Number(review.rating ?? 0), 0) / reviews.length).toFixed(1)
        : null;

      const roomTypes = [
        { total: p.total_1h_rooms, availableHeads: p.available_1h_rooms, headsPerRoom: 1 },
        { total: p.total_2h_rooms, availableHeads: p.available_2h_rooms, headsPerRoom: 2 },
        { total: p.total_3h_rooms, availableHeads: p.available_3h_rooms, headsPerRoom: 3 },
        { total: p.total_4h_rooms, availableHeads: p.available_4h_rooms, headsPerRoom: 4 }
      ];
      const inventoryConfigured = roomTypes.every((room: any) => room.total !== null && room.total !== undefined);
      let occupancyText = "Not configured.";
      if (inventoryConfigured) {
        const totalHeads = roomTypes.reduce((sum: number, room: any) => sum + Number(room.total) * room.headsPerRoom, 0);
        const availableHeads = roomTypes.reduce((sum: number, room: any) => sum + Number(room.availableHeads ?? 0), 0);
        const occupiedHeads = totalHeads - availableHeads;
        if (totalHeads <= 0) {
          occupancyText = "Not available — total room capacity is zero.";
        } else if (availableHeads < 0 || availableHeads > totalHeads) {
          occupancyText = "Unable to calculate — available head counts do not match total capacity.";
        } else {
          occupancyText = ((occupiedHeads / totalHeads) * 100).toFixed(1) + "% (" + occupiedHeads + "/" + totalHeads + " heads occupied)";
        }
      }

      const reply = [
        "*PROPERTY INSIGHTS* 📊",
        "*" + String(p.name ?? "Unnamed property") + "*",
        "Property reference: " + String(p.property_no ?? p.id),
        "",
        "*BOOKING ACTIVITY* 📓",
        "Total booking requests: " + bookings.length,
        "Pending: " + countStatus(["pending"]),
        "Accepted / confirmed: " + countStatus(["provider_accepted", "confirmed"]),
        "Completed: " + countStatus(["completed"]),
        "Declined / cancelled: " + countStatus(["provider_declined", "cancelled"]),
        "",
        "*CURRENT OCCUPANCY* 👥",
        "Percentage occupied: " + occupancyText,
        "",
        "*REVIEWS* 🧮",
        "Total reviews: " + reviews.length,
        "Average rating: " + (averageRating === null ? "No ratings yet" : averageRating + " / 5"),
        "",
        "_All insights are presented as per the property\u0027s yearly activity._"
      ].join("\n");
      return json({ handled: true, reply: reply.slice(0, 3000), interactive: { type: "button", body: "Property insights", buttons: [
        { id: "provider_property_" + p.id, title: "Property Details" },
        { id: "main_menu", title: "Main Menu" }
      ] } });
    }
    if (["menu_insights", "property_insights", "insights", "provider_insights"].includes(lower)) {
      const properties = await db.from("properties")
        .select("id,property_no,name")
        .eq("provider_id", account.id)
        .order("name")
        .limit(50);
      if (properties.error) throw properties.error;
      const props = properties.data ?? [];
      return json({
        handled: true,
        reply: "",
        interactive: props.length ? {
          type: "list",
          header: "Property Insights",
          button: "Select property",
          sections: [{
            title: "Your properties",
            rows: props.slice(0, 10).map((p: any) => ({
              id: "provider_insight_" + p.id,
              title: String(p.name ?? p.property_no ?? "Property").slice(0, 24),
              description: String(p.property_no ?? p.id).slice(0, 72)
            }))
          }]
        } : {
          type: "button",
          body: "No properties are linked to your provider account.",
          buttons: [{ id: "main_menu", title: "Main Menu" }]
        }
      });
    }
    return json({ handled: true, reply: "Open Property Insights from the Provider Menu." });
  } catch (error) {
    console.error("provider-property-insights failed", error);
    return json({ error: "Unable to manage property insights right now." }, 500);
  }
});