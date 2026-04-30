// Smart search via Lovable AI Gateway
// Receives a free-text query + the list of all searchable items,
// returns the most relevant item paths ranked by relevance.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SearchItem {
  label: string;
  path: string;
  category: string;
  keywords?: string[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, items } = (await req.json()) as {
      query: string;
      items: SearchItem[];
    };

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return new Response(JSON.stringify({ paths: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ paths: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Compact catalog for the model
    const catalog = items
      .map(
        (i, idx) =>
          `${idx}. ${i.label} [${i.category}]${
            i.keywords?.length ? ` — ${i.keywords.join(", ")}` : ""
          } → ${i.path}`
      )
      .join("\n");

    const systemPrompt = `Du er en medisinsk søkeassistent for en privatklinikk i Norge (gynekologi, fertilitet, urologi, ortopedi m.m.).
Brukere skriver ofte symptomer eller folkelige beskrivelser ("vondt i pungen", "klør nedentil", "blir ikke gravid").
Du får en katalog over alle behandlinger/sider på nettstedet, og skal returnere de mest relevante – maks 6, sortert etter relevans.
Bruk medisinsk kunnskap til å forstå hva brukeren mener. Returner kun paths som finnes i katalogen.
Hvis søket ikke gir noen rimelig medisinsk match, returner tom liste.`;

    const userPrompt = `Brukerens søk: "${query}"

Katalog:
${catalog}

Returner de mest relevante treffene via verktøyet.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_relevant_results",
                description:
                  "Returner de mest relevante paths fra katalogen, sortert etter relevans (mest relevant først).",
                parameters: {
                  type: "object",
                  properties: {
                    paths: {
                      type: "array",
                      description:
                        "Liste over relevante paths (maks 6), kun paths som finnes i katalogen.",
                      items: { type: "string" },
                    },
                  },
                  required: ["paths"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "return_relevant_results" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "rate_limited", paths: [] }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "payment_required", paths: [] }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "ai_error", paths: [] }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    let paths: string[] = [];
    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        if (Array.isArray(parsed.paths)) paths = parsed.paths;
      } catch (e) {
        console.error("Failed to parse tool args:", e);
      }
    }

    // Filter to only valid paths from input
    const validPaths = new Set(items.map((i) => i.path));
    paths = paths.filter((p) => validPaths.has(p)).slice(0, 6);

    return new Response(JSON.stringify({ paths }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("smart-search error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
        paths: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
