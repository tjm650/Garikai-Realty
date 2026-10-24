import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const json = (body: unknown, status = 200) => Response.json(body, { status });
const digits = (v: unknown) => String(v ?? "").replace(/\D/g, "");
async function providerByPhone(phone: string) {
  const q = await db.from("providers").select("id,business_name,phone_number,is_active,verified")
    .eq("is_active", true).eq("verified", true);
  if (q.error) throw q.error;
  return (q.data ?? []).find((p: any) => digits(p.phone_number) === digits(phone)) ?? null;
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
    const provider = await providerByPhone(phone);
    if (!provider) return json({ handled: false, error: "Provider not found or inactive" }, 404);
    const lower = command.toLowerCase();
    const updateMatch = command.match(/^update\s+([a-z0-9-]+)\s+(\{[\s\S]+\})$/i);
    if (updateMatch) {
      let insights: any;
      try { insights = JSON.parse(updateMatch[2]); } catch { return json({ handled: true, reply: "I could not read that JSON. Please use: update PROPERTY-NO {\"available_rooms\":10,\"pricing\":{\"price/month\":100}}" }); }
      if (!insights || typeof insights !== "object" || Array.isArray(insights)) return json({ handled: true, reply: "The update must be a JSON object." });
      const result = await db.rpc("submit_provider_insights", { p_provider_id: provider.id, p_property_no: updateMatch[1], p_insights: insights });
      if (result.error) throw result.error;
      const outcome = result.data ?? {};
      return json({ handled: true, reply: outcome.success
        ? "Property insights updated successfully. Updated fields: " + (outcome.updated_fields ?? []).join(", ")
        : String(outcome.message ?? "No changes were applied."),
        interactive: { type: "button", body: "Property insights", buttons: [
          { id: "menu_insights", title: "Insights Menu" },
          { id: "menu_properties", title: "My Properties" },
          { id: "provider_menu", title: "Provider Menu" }
        ] } });
    }
    const selected = lower.match(/^provider_insight_([0-9a-f-]{36})$/i);
    if (selected) {
      const q = await db.from("properties").select("id,property_no,name,available_rooms,total_rooms,available_1h_rooms,available_2h_rooms,available_3h_rooms,available_4h_rooms,price_per_month,price_per_week,price_per_day,price_per_semester,gender_preference,amenities")
        .eq("id", selected[1]).eq("provider_id", provider.id).maybeSingle();
      if (q.error) throw q.error;
      const p = q.data;
      if (!p) return json({ handled: true, reply: "That property was not found under your provider account." });
      const sample = { available_rooms: p.available_rooms ?? 0, total_rooms: p.total_rooms ?? 0, available_slots: { "1h/room": p.available_1h_rooms ?? 0, "2h/room": p.available_2h_rooms ?? 0, "3h/room": p.available_3h_rooms ?? 0, "4h/room": p.available_4h_rooms ?? 0 }, pricing: { "price/month": p.price_per_month, "price/week": p.price_per_week, "price/day": p.price_per_day, "price/term": p.price_per_semester }, gender_preference: p.gender_preference };
      return json({ handled: true, reply: "PROPERTY INSIGHTS • " + (p.name ?? p.property_no) + "\nProperty reference: " + p.property_no + "\nCurrent values: " + JSON.stringify(sample) + "\n\nTo update, send one message in this format:\nupdate " + p.property_no + " " + JSON.stringify({ available_rooms: 10, pricing: { "price/month": 100 } }) + "\n\nAllowed fields include total_rooms, available_rooms, available_slots, pricing, gender_preference and amenities." });
    }
    if (["menu_insights", "property_insights", "insights", "provider_insights"].includes(lower)) {
      const [properties, bookings] = await Promise.all([
        db.from("properties").select("id,property_no,name,is_available").eq("provider_id", provider.id).order("name").limit(50),
        db.from("bookings").select("id,status").eq("provider_id", provider.id).limit(1000)
      ]);
      if (properties.error) throw properties.error;
      if (bookings.error) throw bookings.error;
      const props = properties.data ?? [], bs = bookings.data ?? [];
      const count = (status: string) => bs.filter((b: any) => String(b.status ?? "").toLowerCase() === status).length;
      const available = props.filter((p: any) => p.is_available === true).length;
      const bodyText = [
        "GARIKAI REALTY • PROPERTY INSIGHTS",
        "Provider: " + (provider.business_name ?? "Provider"),
        "Total properties: " + props.length,
        "Available: " + available,
        "Unavailable: " + (props.length - available),
        "Booking requests recorded (latest 1,000): " + bs.length,
        "Pending: " + count("pending"),
        "Accepted: " + count("provider_accepted"),
        "Confirmed: " + count("confirmed"),
        "Declined: " + count("provider_declined"),
        "",
        "Select a property to view or update its insights."
      ].join("\n");
      return json({ handled: true, success: true, reply: bodyText, insights: {
        property_count: props.length, available_properties: available, unavailable_properties: props.length - available,
        booking_count: bs.length, pending_bookings: count("pending"), accepted_bookings: count("provider_accepted"),
        confirmed_bookings: count("confirmed"), declined_bookings: count("provider_declined")
      }, interactive: props.length ? { type: "list", header: "Property Insights", body: "Choose a property to inspect or update.", button: "Select property", sections: [{ title: "Your properties", rows: props.slice(0, 10).map((p: any) => ({ id: "provider_insight_" + p.id, title: String(p.name ?? p.property_no ?? "Property").slice(0, 24), description: String(p.property_no ?? p.id).slice(0, 72) })) }] } : { type: "button", body: "No properties are linked to your provider account.", buttons: [{ id: "provider_menu", title: "Provider Menu" }] } });
    }
    return json({ handled: true, reply: "Choose Property Insights from the Provider Menu to view metrics or update a property's insights." });
  } catch (error) {
    console.error("provider-property-insights failed", error);
    return json({ error: "Unable to manage property insights right now." }, 500);
  }
});