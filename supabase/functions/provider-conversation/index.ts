import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const SUPA = Deno.env.get("SUPABASE_URL")!;
const KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const json = (body: unknown, status = 200) => Response.json(body, { status });
const digits = (v: unknown) => String(v ?? "").replace(/\D/g, "");
const MAIN_MENU = {
  type: "list", header: "Garikai Realty • Provider",
  body: "Welcome. Choose a provider service below.",
  button: "Open menu",
  sections: [{ title: "Provider Menu", rows: [
    { id: "menu_bookings", title: "Manage Bookings" },
    { id: "menu_properties", title: "Manage Properties" },
    { id: "menu_insights", title: "Property Insights" },
    { id: "menu_about_us", title: "About Us" }
  ] }]
};
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
    const phone = String(body?.phone_number ?? "").trim();
    const message = String(body?.message ?? "").trim();
    if (!phone || !message) return json({ error: "phone_number and message are required" }, 400);
    const provider = await providerByPhone(phone);
    if (!provider) return json({ handled: false, error: "Provider not found or inactive" }, 404);
    const cmd = message.toLowerCase();
    if (["hi", "hello", "hey", "menu", "provider_menu", "start", "provider menu"].includes(cmd)) {
      return json({ handled: true, reply: "Welcome to Garikai Realty, " + (provider.business_name ?? "Provider") + ". Choose a service from your menu.", interactive: MAIN_MENU });
    }
    let slug = "";
    let forwarded = message;
    if (["menu_bookings", "manage_bookings", "provider_booking_requests", "booking_requests", "provider_refresh"].includes(cmd) || /^provider_(accept|decline|booking)_[0-9a-f-]{36}$/i.test(cmd)) {
      slug = "provider-manage-bookings";
      if (["menu_bookings", "manage_bookings", "provider_booking_requests"].includes(cmd)) forwarded = "booking_requests";
    } else if (["menu_properties", "manage_properties", "provider_properties", "properties", "property management"].includes(cmd) || /^provider_(property|toggle_availability)_[0-9a-f-]{36}$/i.test(cmd)) {
      slug = "provider-manage-properties";
      if (["menu_properties", "manage_properties", "provider_properties", "properties", "property management"].includes(cmd)) forwarded = "menu_properties";
    } else if (["menu_insights", "property_insights", "insights"].includes(cmd)) {
      slug = "provider-property-insights";
      forwarded = "property_insights";
    } else if (["menu_about_us", "about_us", "about us"].includes(cmd)) {
      const response = await fetch(SUPA + "/functions/v1/about-us", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + KEY, "apikey": KEY },
        body: JSON.stringify({ phone_number: phone })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error ?? "about-us failed");
      return json({ handled: true, reply: result.reply ?? "", interactive: MAIN_MENU });
    } else {
      return json({ handled: true, reply: "Choose a service from the Provider Menu.", interactive: MAIN_MENU });
    }
    const response = await fetch(SUPA + "/functions/v1/" + slug, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-jeff-provider-secret": secret },
      body: JSON.stringify({ phone_number: phone, message: forwarded })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result?.error ?? (slug + " returned " + response.status));
    return json({ ...result, handled: true, interactive: result.interactive ?? MAIN_MENU });
  } catch (error) {
    console.error("provider-conversation router failed", error);
    return json({ error: "Unable to process the provider request right now." }, 500);
  }
});