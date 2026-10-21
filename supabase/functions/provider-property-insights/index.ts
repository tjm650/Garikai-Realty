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
    if (!phone) return json({ error: "phone_number is required" }, 400);
    const provider = await providerByPhone(phone);
    if (!provider) return json({ handled: false, error: "Provider not found or inactive" }, 404);
    const [properties, bookings] = await Promise.all([
      db.from("properties").select("id,name,is_available,price_per_month").eq("provider_id", provider.id),
      db.from("bookings").select("id,status,price_amount,created_at").eq("provider_id", provider.id).limit(1000)
    ]);
    if (properties.error) throw properties.error;
    if (bookings.error) throw bookings.error;
    const props = properties.data ?? [];
    const bs = bookings.data ?? [];
    const count = (status: string) => bs.filter((b: any) => String(b.status ?? "").toLowerCase() === status).length;
    const total = bs.length;
    const accepted = bs.filter((b: any) => ["provider_accepted", "awaiting_payment", "confirmed", "completed"].includes(String(b.status ?? "").toLowerCase())).length;
    const declined = count("provider_declined");
    const pending = count("pending");
    const available = props.filter((p: any) => p.is_available === true).length;
    const unavailable = props.length - available;
    const bodyText = [
      "GARIKAI REALTY • PROPERTY INSIGHTS",
      "Provider: " + (provider.business_name ?? "Provider"),
      "",
      "PROPERTIES",
      "Total properties: " + props.length,
      "Available: " + available,
      "Unavailable: " + unavailable,
      "",
      "BOOKING ACTIVITY",
      "Booking requests recorded (latest 1,000): " + total,
      "Pending: " + pending,
      "Accepted / progressing / confirmed: " + accepted,
      "Declined: " + declined,
      "",
      "These figures reflect current records returned by Supabase and are not a financial statement."
    ].join("\n");
    return json({ handled: true, success: true, reply: bodyText, insights: {
      property_count: props.length, available_properties: available, unavailable_properties: unavailable,
      booking_count: total, pending_bookings: pending, accepted_or_progressing_bookings: accepted, declined_bookings: declined
    }, interactive: { type: "button", body: "Property insights", buttons: [
      { id: "menu_properties", title: "My Properties" },
      { id: "provider_booking_requests", title: "Manage Bookings" },
      { id: "provider_menu", title: "Provider Menu" }
    ] } });
  } catch (error) {
    console.error("provider-property-insights failed", error);
    return json({ error: "Unable to retrieve property insights right now." }, 500);
  }
});