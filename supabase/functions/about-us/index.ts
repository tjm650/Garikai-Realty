import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const json = (body: unknown, status = 200) => Response.json(body, { status });

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return json({ error: "unauthorized" }, 401);
  }
  return json({
    success: true,
    reply: "Garikai Realty helps students find accommodation and helps property providers manage booking requests and property information. We connect students with accommodation options and support providers throughout the booking journey.",
    company: "Garikai Realty"
  });
});