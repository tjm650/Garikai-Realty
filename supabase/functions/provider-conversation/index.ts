import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const SUPA = Deno.env.get("SUPABASE_URL")!;
const KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
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
const digits = (v: unknown) => String(v ?? "").replace(/\D/g, "");
const PROVIDER_MENU = {
  type: "list",
  button: "Open menu",
  sections: [{ title: "Provider Menu", rows: [
    { id: "menu_properties", title: "Property Account" },
    { id: "menu_my_account", title: "My Account" },
    { id: "menu_bookings", title: "Bookings" },
    { id: "menu_about_us", title: "About Us" }
  ] }]
};

async function providerByPhone(phone: string) {
  const q = await db.from("providers").select("id,business_name,phone_number,is_active,verified,first_name,surname,gender,contact_name,created_at")
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
    const phone = String(body?.phone_number ?? "").trim();
    const message = String(body?.message ?? "").trim();
    if (!phone || !message) return json({ error: "phone_number and message are required" }, 400);
    const provider = await providerByPhone(phone);
    if (!provider) return json({ handled: false, error: "Verified provider not found" }, 404);
    const cmd = message.toLowerCase();
    if (["hi", "hello", "hey", "menu", "provider_menu", "main_menu", "start", "provider menu", "main menu"].includes(cmd)) {
      const title = provider.gender === "Male" ? "Mr" : provider.gender === "Female" ? "Ms" : "";
      const surname = String(provider.surname ?? "").trim();
      const greetingName = [title, surname].filter(Boolean).join(" ") || "Provider";
      const greeting = `Hi 👋 ${greetingName}, I'm Garikai. Choose a property you want to manage today. 
      
_You can only manage verified properties._`;
      const clearedAccountEdit = await db.from("provider_account_edit_sessions").delete().eq("phone_digits", digits(phone));
      if (clearedAccountEdit.error) throw clearedAccountEdit.error;
      return json({ handled: true, reply: greeting, interactive: { ...PROVIDER_MENU} });
    }
    let slug = "";
    let forwarded = message;
    if (["menu_bookings", "manage_bookings", "provider_booking_requests", "booking_requests", "provider_refresh"].includes(cmd) || /^provider_(accept|decline|booking)_[0-9a-f-]{36}$/i.test(cmd)) {
      slug = "provider-manage-bookings";
      if (["menu_bookings", "manage_bookings", "provider_booking_requests"].includes(cmd)) forwarded = "booking_requests";
    } else if (["menu_properties", "menu_property_account", "manage_properties", "provider_properties", "properties", "property management", "property account", "exit", "provider_exit_edit_session"].includes(cmd) || /^provider_(property|toggle_availability|confirm_availability|edit|confirm_edit|cancel_edit|assign|history)_[0-9a-f-]{36}$/i.test(cmd) || /^provider_editfield_[0-9a-f-]{36}_[a-z0-9_]+$/i.test(cmd) || /^provider_editsection_[0-9a-f-]{36}_(rooms|prices|location)$/i.test(cmd) || /^provider_pickvalue_[0-9a-f-]{36}_[a-z_]+_[0-9]+$/i.test(cmd)) {
      slug = "provider-manage-properties";
      if (["menu_properties", "menu_property_account", "manage_properties", "provider_properties", "properties", "property management", "property account"].includes(cmd)) forwarded = "menu_properties";
    } else if (["menu_insights", "property_insights", "insights", "provider_insights"].includes(cmd)) {
      slug = "provider-property-insights";
      forwarded = "property_insights";
    } else if (/^provider_insight_[0-9a-f-]{36}$/i.test(cmd) || /^update\s+/i.test(message)) {
      slug = "provider-property-insights";
      forwarded = message;
    } else if (["menu_my_account", "my_account", "my account"].includes(cmd)) {
      return json({ handled: true, interactive: {
        type: "list", body: "Select any account option in the menu.",
        button: "Account options",
        sections: [{ title: "My Account", rows: [
          { id: "provider_account_view", title: "View Account" },
          { id: "provider_account_edit", title: "Edit Account" },
          { id: "provider_account_status", title: "Account Status" },
          { id: "main_menu", title: "Main Menu" }
        ] }]
      }});
    } else if (cmd === "provider_account_view") {
      const fullName = [provider.first_name, provider.surname].map((v: unknown) => String(v ?? "").trim()).filter(Boolean).join(" ");
      const contactName = String(provider.first_name + " " + provider.surname ?? "").trim() || fullName || "Not set";
      const registered = provider.created_at
        ? new Date(provider.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Harare" })
        : "Not available";
      const profile = [
        "*ACCOUNT DETAILS*",
        "",
        "*Business name*",
        String(provider.business_name ?? "_Not set_"),
        "",
        "*Name*",
        contactName,
        "",
        "*Registered phone number*",
        String(provider.phone_number ?? "Not set"),
        "",
        "*Date Registered*",
        registered
      ].join("\n");
      return json({ handled: true, reply: profile, interactive: {
        type: "button",
        buttons: [
          { id: "main_menu", title: "Main Menu" }
        ]
      }});
    } else if (cmd === "provider_account_status") {
      return json({ handled: true, reply: [
        "*ACCOUNT STATUS*",
        "",
        "Activity: " + (provider.is_active ? "Active" : "Inactive"),
      
        "Status: " + (provider.verified ? "Verified" : "Not verified"),
      ].join("\n"), interactive: {
        type: "button",
        buttons: [
          { id: "main_menu", title: "Main Menu" }
        ]
      }});
    } else if (cmd === "provider_account_edit") {
      return json({ handled: true, reply: `*EDIT ACCOUNT*\n\n1. Registered phone number, personal details and status can only be changed by administrators.\n\n2. Changes will only be saved after you review and confirm them.`, interactive: {
        type: "list", button: "Choose field",
        sections: [{ title: "Account details", rows: [
          { id: "provider_account_field_business_name", title: "Business Name", description: "What's your business name" },
          { id: "provider_account_cancel", title: "Cancel"}
        ] }]
      }});
    } else if (cmd === "provider_account_field_business_name" || cmd === "provider_account_field_contact_name") {
      const field = cmd.endsWith("business_name") ? "business_name" : "contact_name";
      const currentValue = String((provider as any)[field] ?? "").trim() || "Not set";
      const prompt = field === "business_name"
        ? "*BUSINESS NAME*\nCurrent name: " + currentValue + "\n\nWhat would you like your business to be called?"
        : "*CONTACT NAME*\\n━━━━━━━━━━━━━━━━━━\\nCurrent contact: " + currentValue + "\\n\\nSend the new contact person's name in one message.\\n\\nYou will be asked to confirm before it is saved.";
      const session = await db.from("provider_account_edit_sessions").upsert({
        phone_digits: digits(phone), provider_id: provider.id, field_name: field,
        pending_value: null, updated_at: new Date().toISOString()
      }, { onConflict: "phone_digits" });
      if (session.error) throw session.error;
      return json({ handled: true, reply: prompt, interactive: { type: "button", buttons: [{ id: "provider_account_cancel", title: "Cancel" }] } });
    } else if (cmd === "provider_account_confirm") {
      const session = await db.from("provider_account_edit_sessions").select("provider_id,field_name,pending_value")
        .eq("phone_digits", digits(phone)).maybeSingle();
      if (session.error) throw session.error;
      if (!session.data || session.data.provider_id !== provider.id || !session.data.pending_value) {
        return json({ handled: true, reply: "There is no account change waiting for confirmation. Open My Account to try again.", interactive: { type: "button", body: "Choose an option below.", buttons: [{ id: "menu_my_account", title: "My Account" }, { id: "main_menu", title: "Main Menu" }] } });
      }
      const field = session.data.field_name;
      if (!["business_name", "contact_name"].includes(field)) throw new Error("Invalid account edit field");
      const value = String(session.data.pending_value).trim();
      const update = await db.from("providers").update({ [field]: value, updated_at: new Date().toISOString() })
        .eq("id", provider.id).select("id").maybeSingle();
      if (update.error) throw update.error;
      if (!update.data) return json({ handled: true, reply: "Your account details were not updated. Please try again." });
      const cleared = await db.from("provider_account_edit_sessions").delete().eq("phone_digits", digits(phone));
      if (cleared.error) throw cleared.error;
      return json({ handled: true, reply: (field === "business_name" ? "Business name" : "Contact person") + " saved successfully", interactive: {
        type: "button",
        buttons: [
          { id: "main_menu", title: "Main Menu" }
        ]
      }});
    } else if (cmd === "provider_account_cancel") {
      const cleared = await db.from("provider_account_edit_sessions").delete().eq("phone_digits", digits(phone)).eq("provider_id", provider.id);
      if (cleared.error) throw cleared.error;
      return json({ handled: true, reply: "Session exit, thanks for your time, bye👋"});
    } else if (["menu_about_us", "about_us", "about us"].includes(cmd)) {
      const response = await fetch(SUPA + "/functions/v1/about-us", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + KEY, "apikey": KEY },
        body: JSON.stringify({ phone_number: phone })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error ?? "about-us failed");
      return json({ handled: true, reply: result.reply ?? ""});
    } else {
    }
    // Active provider property edit session routing: plain replies such as "3" must
    // reach the property handler that is waiting for the provider's pending value.
    if (!slug) {
      const accountEditSession = await db.from("provider_account_edit_sessions")
        .select("provider_id,field_name,pending_value")
        .eq("phone_digits", digits(phone))
        .maybeSingle();
      if (accountEditSession.error) throw accountEditSession.error;
      if (accountEditSession.data && accountEditSession.data.provider_id === provider.id) {
        const value = message.trim();
        const field = accountEditSession.data.field_name;
        const maxLength = field === "business_name" ? 100 : 100;
        if (value.length < 2 || value.length > maxLength || /[\r\n\t]/.test(value)) {
          return json({ handled: true, reply: "Please send a valid " + (field === "business_name" ? "business name" : "contact person's name") + " using 2–100 characters. No changes have been made.", interactive: { type: "button", buttons: [{ id: "provider_account_cancel", title: "Cancel" }] } });
        }
        if (["menu_my_account", "my_account", "my account", "provider_account_cancel", "provider_account_edit", "main_menu", "provider_menu"].includes(value.toLowerCase())) {
          return json({ handled: true, reply: "Your account edit is still waiting for a value. Send the new name, or choose Cancel below.", interactive: {
            type: "button", body: "No changes have been saved.",
            buttons: [
              { id: "provider_account_cancel", title: "Cancel change" },
              { id: "menu_my_account", title: "My Account" },
              { id: "main_menu", title: "Main Menu" }
            ]
          }});
        }
        const pending = await db.from("provider_account_edit_sessions")
          .update({ pending_value: value, updated_at: new Date().toISOString() })
          .eq("phone_digits", digits(phone)).eq("provider_id", provider.id);
        if (pending.error) throw pending.error;
        const label = field === "business_name" ? "Business name" : "Contact person";
        return json({ handled: true, reply: "*REVIEW YOUR CHANGES*\n\nDetail: " + label + "\nCurrent value: " + String((provider as any)[field] ?? "_Not set_") + "\nNew value: " + value + "\n\n━━━━━━━━━━━━━━━━━━\n"+"_Confirm to save this change, or cancel to leave your account unchanged_.", interactive: {
          type: "button",
          buttons: [
            { id: "provider_account_confirm", title: "Confirm & Save" },
            { id: "provider_account_cancel", title: "Cancel" }
          ]
        }});
      }
      const editSession = await db.from("provider_property_edit_sessions")
        .select("provider_id,property_id,field_name")
        .eq("phone_digits", digits(phone))
        .maybeSingle();
      if (editSession.error) throw editSession.error;
      if (editSession.data && editSession.data.provider_id === provider.id) {
        slug = "provider-manage-properties";
        forwarded = message;
      }
    }
    const response = await fetch(SUPA + "/functions/v1/" + slug, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-jeff-provider-secret": secret },
      body: JSON.stringify({ phone_number: phone, message: forwarded, account_type: "provider" })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result?.error ?? (slug + " returned " + response.status));
    return json({ ...result, handled: true, ...(!result.interactive && !result.reply ? { interactive: PROVIDER_MENU } : {}) });
  } catch (error) {
    console.error("provider-conversation router failed", error);
    return json({ error: "Unable to process the provider request right now." }, 500);
  }
});