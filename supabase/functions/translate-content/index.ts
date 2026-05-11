// Lovable AI Gateway translator: NO -> EN
// POST { texts: string[] } -> { translations: string[] }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT =
  "You translate Norwegian (Bokmål) medical/clinical website content into natural, professional English. " +
  "Return ONLY the translation — no quotes, no preamble, no explanation. " +
  "Preserve formatting characters (dashes, em-dashes, punctuation, line breaks, markdown). " +
  "Keep brand names (CMedical, Livio Oslo) unchanged. " +
  "For very short labels, keep the translation concise and idiomatic.";

async function translateOne(text: string, apiKey: string): Promise<string> {
  if (!text || !text.trim()) return "";
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AI gateway ${res.status}: ${body}`);
  }
  const json = await res.json();
  return json?.choices?.[0]?.message?.content?.trim() || "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const texts: unknown = body?.texts;
    if (!Array.isArray(texts) || texts.some((t) => typeof t !== "string")) {
      return new Response(
        JSON.stringify({ error: "Body must be { texts: string[] }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (texts.length > 200) {
      return new Response(
        JSON.stringify({ error: "Max 200 texts per request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const translations: string[] = [];
    for (const t of texts as string[]) {
      try {
        translations.push(await translateOne(t, apiKey));
      } catch (e) {
        console.error("translate error:", e);
        translations.push("");
      }
    }

    return new Response(JSON.stringify({ translations }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
