import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const db = createClient(SUPABASE_URL, SERVICE_KEY);
const json = (body: unknown, status = 200) => Response.json(body, { status });
const digits = (v: unknown) => String(v ?? "").replace(/\D/g, "");

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!SERVICE_KEY || req.headers.get("authorization") !== `Bearer ${SERVICE_KEY}`) {
    return json({ error: "unauthorized" }, 401);
  }
  try {
    const body = await req.json();
    const phone = String(body?.phone_number ?? "").trim();
    if (!phone || digits(phone).length < 7) return json({ error: "valid phone_number is required" }, 400);
    const conversationResult = await db.from("conversations").select("id").eq("phone_number", phone).limit(10);
    if (conversationResult.error) throw conversationResult.error;
    const conversationIds = (conversationResult.data ?? []).map((c: any) => c.id);
    const [byPhone, byConversation] = await Promise.all([
      db.from("bookings").select("id,booking_number,conversation_id,property_id,provider_id,status,start_date,end_date,rental_period,price_amount,created_at,updated_at,properties(name,address,city,property_no)").eq("guest_phone", phone).order("created_at", { ascending: false }).limit(20),
      conversationIds.length
        ? db.from("bookings").select("id,booking_number,conversation_id,property_id,provider_id,status,start_date,end_date,rental_period,price_amount,created_at,updated_at,properties(name,address,city,property_no)").in("conversation_id", conversationIds).order("created_at", { ascending: false }).limit(20)
        : Promise.resolve({ data: [], error: null })
    ]);
    if (byPhone.error) throw byPhone.error;
    if (byConversation.error) throw byConversation.error;
    const unique = new Map<string, any>();
    for (const booking of [...(byPhone.data ?? []), ...(byConversation.data ?? [])]) unique.set(booking.id, booking);
    const bookings = [...unique.values()].sort((a: any, b: any) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? ""))).slice(0, 20).map((b: any) => ({
      booking_reference: b.booking_number ?? b.id,
      status: b.status,
      property: b.properties?.name ?? "Property",
      address: [b.properties?.address, b.properties?.city].filter(Boolean).join(", ") || null,
      rental_period: b.rental_period ?? null,
      start_date: b.start_date ?? null,
      end_date: b.end_date ?? null,
      price_amount: b.price_amount ?? null,
      created_at: b.created_at,
    }));
    return json({
      success: true,
      count: bookings.length,
      reply: bookings.length
        ? "Your latest Garikai Realty bookings:\n\n" + bookings.map((b: any) =>
            "Reference: " + b.booking_reference + "\nProperty: " + b.property + "\nStatus: " + b.status +
            (b.rental_period ? "\nRental period: " + b.rental_period : "") +
            (b.start_date || b.end_date ? "\nDates: " + (b.start_date ?? "TBC") + " to " + (b.end_date ?? "TBC") : "") +
            (b.price_amount != null ? "\nPrice: " + b.price_amount : "")
          ).join("\n\n")
        : "You do not have any bookings recorded yet.",
      bookings,
    });
  } catch (error) {
    console.error("student-my-bookings failed", error);
    return json({ error: "Unable to retrieve bookings right now." }, 500);
  }
});