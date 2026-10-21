import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const digits = (v: unknown) => String(v ?? "").replace(/\D/g, "");
const json = (body: unknown, status = 200) => Response.json(body, { status });

async function findProvider(phone: string) {
  const q = await db.from("providers").select("id,business_name,phone_number,is_active,verified").eq("is_active", true).eq("verified", true);
  if (q.error) throw new Error(q.error.message);
  return (q.data ?? []).find((p: any) => digits(p.phone_number) === digits(phone)) ?? null;
}
const menu = (body: string, rows: any[], button = "Open requests") => ({
  type: "list", header: "Garikai Realty • Provider", body, button,
  sections: [{ title: "Booking actions", rows: rows.slice(0, 10) }]
});
async function updateConversation(booking: any, status: string, providerMessage: string | null) {
  if (!booking.guest_phone) return;
  const q = await db.from("conversations").select("id,context_data").eq("phone_number", booking.guest_phone).eq("status", "active").order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (q.error || !q.data) return;
  const next = status === "provider_accepted" ? "awaiting_payment" : status === "provider_declined" ? "property_listings" : "booking_request";
  await db.from("conversations").update({
    current_step: next,
    context_data: { ...(q.data.context_data ?? {}), booking_id: booking.id, booking_status: status, provider_response: providerMessage },
    updated_at: new Date().toISOString()
  }).eq("id", q.data.id);
}
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const sharedSecret = Deno.env.get("PROVIDER_WEBHOOK_SECRET");
  if (!sharedSecret || req.headers.get("x-jeff-provider-secret") !== sharedSecret) return json({ error: "unauthorized" }, 401);
  try {
    const body = await req.json();
    const phone = String(body?.phone_number ?? "");
    const message = String(body?.message ?? "").trim();
    if (!phone || !message) return json({ error: "phone_number and message are required" }, 400);
    const provider = await findProvider(phone);
    if (!provider) return json({ handled: false, error: "Provider not found or inactive" }, 404);
    const cmd = message.toLowerCase();
    if (["hi", "hello", "hey", "menu", "provider_menu", "start", "booking_requests"].includes(cmd)) {
      const q = await db.from("bookings").select("id,booking_number,guest_name,guest_phone,property_id,status,created_at,additional_info_requested,properties(name,property_no)").eq("provider_id", provider.id).eq("status", "pending").order("created_at", { ascending: true }).limit(10);
      if (q.error) throw new Error(q.error.message);
      const rows = (q.data ?? []).map((b: any) => ({
        id: "provider_booking_" + b.id,
        title: String(b.booking_number ?? b.id.slice(0, 8)).slice(0, 24),
        description: String((b.properties?.name ?? "Property") + " • " + (b.guest_name ?? "Student")).slice(0, 72)
      }));
      return json({ handled: true, reply: rows.length ? "Welcome to Garikai Realty, " + (provider.business_name ?? "Provider") + ". Select a booking request to review it." : "Welcome to Garikai Realty, " + (provider.business_name ?? "Provider") + ". There are no pending booking requests right now.", interactive: rows.length ? menu("Review a pending accommodation booking request.", rows) : { type: "button", body: "Provider menu", buttons: [{ id: "booking_requests", title: "Refresh requests" }] } });
    }
    if (cmd === "booking_requests" || cmd === "provider_refresh") {
      const q = await db.from("bookings").select("id,booking_number,guest_name,property_id,properties(name)").eq("provider_id", provider.id).eq("status", "pending").order("created_at", { ascending: true }).limit(10);
      if (q.error) throw new Error(q.error.message);
      const rows = (q.data ?? []).map((b: any) => ({ id: "provider_booking_" + b.id, title: String(b.booking_number ?? b.id.slice(0, 8)).slice(0, 24), description: String((b.properties?.name ?? "Property") + " • " + (b.guest_name ?? "Student")).slice(0, 72) }));
      return json({ handled: true, reply: rows.length ? "Your pending booking requests:" : "There are no pending booking requests.", interactive: rows.length ? menu("Select a booking request.", rows) : { type: "button", body: "Provider menu", buttons: [{ id: "booking_requests", title: "Refresh requests" }] } });
    }
    const openMatch = cmd.match(/^provider_booking_([0-9a-f-]{36})$/i);
    if (openMatch) {
      const q = await db.from("bookings").select("id,booking_number,guest_name,guest_phone,property_id,status,start_date,end_date,rental_period,price_amount,notes,additional_info_requested,created_at,properties(name,address,city,property_no)").eq("id", openMatch[1]).eq("provider_id", provider.id).maybeSingle();
      if (q.error) throw new Error(q.error.message);
      const b = q.data;
      if (!b) return json({ handled: true, reply: "I couldn't find that booking under your provider account. Type menu to refresh." });
      if (b.status !== "pending") return json({ handled: true, reply: "This request is no longer pending (current status: " + b.status + "). Type menu to refresh." });
      const details = "Booking request " + (b.booking_number ?? b.id.slice(0, 8)) + "\nProperty: " + (b.properties?.name ?? "N/A") + "\nStudent: " + (b.guest_name ?? "Not supplied") + "\nStudent contact: " + (b.guest_phone ?? "Not supplied") + "\nRental period: " + (b.rental_period ?? "N/A") + "\nDates: " + (b.start_date ?? "Not specified") + " to " + (b.end_date ?? "Not specified") + "\nPrice: " + (b.price_amount ?? "N/A") + "\nNotes: " + (b.notes ?? "None") + "\n\nChoose an action below.";
      return json({ handled: true, reply: details.slice(0, 3000), interactive: { type: "button", body: "Booking " + (b.booking_number ?? b.id.slice(0, 8)) + ": accept or decline this request.", buttons: [{ id: "provider_accept_" + b.id, title: "Accept" }, { id: "provider_decline_" + b.id, title: "Decline" }, { id: "booking_requests", title: "Back to requests" }] } });
    }
    const action = cmd.match(/^provider_(accept|decline)_([0-9a-f-]{36})$/i);
    if (action) {
      const choice = action[1].toLowerCase();
      const bookingId = action[2];
      const q = await db.from("bookings").select("id,booking_number,provider_id,guest_name,guest_phone,property_id,status,properties(name)").eq("id", bookingId).eq("provider_id", provider.id).maybeSingle();
      if (q.error) throw new Error(q.error.message);
      const b = q.data;
      if (!b) return json({ handled: true, reply: "This booking does not belong to your provider account." });
      if (b.status !== "pending") return json({ handled: true, reply: "This booking was already processed (status: " + b.status + "). Type menu to refresh." });
      const status = choice === "accept" ? "provider_accepted" : "provider_declined";
      const now = new Date().toISOString();
      const patch: any = { status, provider_response: choice === "accept" ? "Accepted by provider via WhatsApp" : "Declined by provider via WhatsApp", updated_at: now };
      if (choice === "decline") { patch.rejected_at = now; patch.rejection_reason = "Declined by provider via WhatsApp"; }
      const upd = await db.from("bookings").update(patch).eq("id", bookingId).eq("provider_id", provider.id).eq("status", "pending").select("id,status,booking_number,guest_phone,guest_name").maybeSingle();
      if (upd.error) throw new Error(upd.error.message);
      if (!upd.data) return json({ handled: true, reply: "This request was processed by another action. Type menu to refresh." });
      await updateConversation({ ...b, ...upd.data }, status, patch.provider_response);
      const outcome = choice === "accept" ? "accepted" : "declined";
      const notifyText = "Garikai Realty booking update\nBooking reference: " + (b.booking_number ?? bookingId.slice(0, 8)) + "\nProperty: " + (b.properties?.name ?? "your selected property") + "\nStatus: " + (choice === "accept" ? "The provider has accepted your request. The booking is not confirmed until the next steps are completed." : "The provider has declined your request. Please return to the listings to choose another property.") ;
      return json({ handled: true, reply: "Booking " + (b.booking_number ?? bookingId.slice(0, 8)) + " has been " + outcome + ". The student has been queued for a status update. Type menu to review other requests.", notify_student: b.guest_phone ? { phone_number: b.guest_phone, text: notifyText } : null });
    }
    return json({ handled: true, reply: "Provider menu: type menu to view pending booking requests, then select a request to accept or decline it.", interactive: { type: "button", body: "Provider menu", buttons: [{ id: "booking_requests", title: "View requests" }] } });
  } catch (e) {
    console.error("provider-conversation error", e);
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});