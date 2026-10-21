import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const json = (body: unknown, status = 200) => Response.json(body, { status });
const digits = (v: unknown) => String(v ?? "").replace(/\D/g, "");
const menu = (body: string, rows: any[], title = "Your properties") => ({
  type: "list", header: "Garikai Realty • Properties", body, button: "Choose property",
  sections: [{ title, rows: rows.slice(0, 10) }]
});
async function providerByPhone(phone: string) {
  const q = await db.from("providers").select("id,business_name,phone_number,is_active,verified")
    .eq("is_active", true).eq("verified", true);
  if (q.error) throw q.error;
  return (q.data ?? []).find((p: any) => digits(p.phone_number) === digits(phone)) ?? null;
}
async function properties(providerId: string) {
  const q = await db.from("properties")
    .select("id,property_no,name,address,city,property_type,price_per_month,price_per_week,price_per_day,is_available,available_1h_rooms,available_2h_rooms,available_3h_rooms,available_4h_rooms")
    .eq("provider_id", providerId).order("name").limit(50);
  if (q.error) throw q.error;
  return q.data ?? [];
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
    if (["menu_properties", "manage_properties", "provider_properties", "properties", "property management"].includes(lower)) {
      const rows = await properties(provider.id);
      return json({ handled: true, reply: rows.length
        ? "Here are your properties. Select one to view its details and availability."
        : "There are no properties linked to your provider account yet.",
        interactive: rows.length ? menu("Manage your property information and availability.", rows.map((p: any) => ({
          id: "provider_property_" + p.id,
          title: String(p.name ?? p.property_no ?? "Property").slice(0, 24),
          description: (p.is_available ? "Available" : "Unavailable") + " • " + (p.price_per_month != null ? "$" + p.price_per_month + "/month" : "Rent not set")
        }))) : { type: "button", body: "Property management", buttons: [{ id: "provider_menu", title: "Provider Menu" }] } });
    }
    const toggle = lower.match(/^provider_toggle_availability_([0-9a-f-]{36})$/i);
    if (toggle) {
      const id = toggle[1];
      const current = await db.from("properties").select("id,name,is_available").eq("id", id).eq("provider_id", provider.id).maybeSingle();
      if (current.error) throw current.error;
      if (!current.data) return json({ handled: true, reply: "That property was not found under your provider account." });
      const updated = await db.from("properties").update({ is_available: !current.data.is_available, updated_at: new Date().toISOString() })
        .eq("id", id).eq("provider_id", provider.id).eq("is_available", current.data.is_available)
        .select("id,name,is_available").maybeSingle();
      if (updated.error) throw updated.error;
      if (!updated.data) return json({ handled: true, reply: "The property changed while you were working. Refresh your property list and try again." });
      return json({ handled: true, reply: String(updated.data.name ?? "Property") + " is now marked " + (updated.data.is_available ? "available" : "unavailable") + ".", interactive: { type: "button", body: "Property updated", buttons: [{ id: "menu_properties", title: "My Properties" }, { id: "provider_menu", title: "Provider Menu" }] } });
    }
    const open = lower.match(/^provider_property_([0-9a-f-]{36})$/i);
    if (open) {
      const id = open[1];
      const q = await db.from("properties").select("id,property_no,name,address,city,property_type,description,price_per_month,price_per_week,price_per_day,is_available,available_1h_rooms,available_2h_rooms,available_3h_rooms,available_4h_rooms").eq("id", id).eq("provider_id", provider.id).maybeSingle();
      if (q.error) throw q.error;
      const p = q.data;
      if (!p) return json({ handled: true, reply: "That property was not found under your provider account." });
      const reply = [
        "PROPERTY DETAILS",
        "Name: " + (p.name ?? "Not set"),
        "Reference: " + (p.property_no ?? p.id),
        "Address: " + [p.address, p.city].filter(Boolean).join(", "),
        "Type: " + (p.property_type ?? "Not set"),
        "Monthly rent: " + (p.price_per_month ?? "Not set"),
        "Weekly rent: " + (p.price_per_week ?? "Not set"),
        "Daily rent: " + (p.price_per_day ?? "Not set"),
        "Availability: " + (p.is_available ? "Available" : "Unavailable"),
        "Room counts (1H/2H/3H/4H): " + [p.available_1h_rooms, p.available_2h_rooms, p.available_3h_rooms, p.available_4h_rooms].map((v: any) => v ?? 0).join(" / "),
        "Description: " + (p.description ?? "Not set")
      ].join("\n");
      return json({ handled: true, reply: reply.slice(0, 3000), interactive: { type: "button", body: "Property availability", buttons: [
        { id: "provider_toggle_availability_" + p.id, title: p.is_available ? "Mark Unavailable" : "Mark Available" },
        { id: "menu_properties", title: "My Properties" },
        { id: "provider_menu", title: "Provider Menu" }
      ] } });
    }
    return json({ handled: true, reply: "Choose Manage Properties from the Provider Menu to view your properties." });
  } catch (error) {
    console.error("provider-manage-properties failed", error);
    return json({ error: "Unable to manage properties right now." }, 500);
  }
});