import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Content-Type": "application/json; charset=utf-8" } });

const ABOUT_US = `🏡 ABOUT GARIKAI STUDENTS

Garikai Students, powered by Garikai Realty, connects students seeking accommodation with property providers offering rooms and student accommodation across Zimbabwe.

🔎 FOR STUDENTS
Search available properties, compare monthly rental prices, locations, room availability and listed amenities, and submit booking requests for accommodation that suits your needs and budget.

🏠 FOR PROPERTY PROVIDERS
List and manage your properties, update rental details and room availability, and receive and manage booking requests from students seeking accommodation.

📋 A CONNECTED ACCOMMODATION EXPERIENCE
Our WhatsApp service helps students explore accommodation and enables providers to manage property-related enquiries in a more organised way.

🌐 EXPLORE GARIKAI REALTY
Visit the Garikai Realty website to learn about the platform's accommodation search, booking and property management features.

Garikai Students — connecting students with accommodation providers across Zimbabwe.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-jeff-provider-secret",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    // Support both existing callers: provider-conversation uses the service-role
    // bearer token; the former dedicated About Us function used this webhook secret.
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const webhookSecret = Deno.env.get("PROVIDER_WEBHOOK_SECRET");
    const authorization = req.headers.get("authorization");
    const suppliedWebhookSecret = req.headers.get("x-jeff-provider-secret");
    const authorized =
      (!!serviceRoleKey && authorization === `Bearer ${serviceRoleKey}`) ||
      (!!webhookSecret && suppliedWebhookSecret === webhookSecret);

    if (!authorized) return json({ error: "unauthorized" }, 401);

    return json({
      success: true,
      agent: "garikai-students",
      company: "Garikai Realty",
      reply: ABOUT_US,
    });
  } catch (error) {
    console.error("about-us failed", error);
    return json({ error: "Unable to retrieve company information right now." }, 500);
  }
});