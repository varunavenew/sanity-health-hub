import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, message } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY er ikke konfigurert');
    }

    const systemPrompt = `Du er Ida, en AI-assistent som spesialiserer seg på hudpleie.

VIKTIGE REGLER FOR KOMMUNIKASJON:

1. VURDER FØRST hva kunden egentlig spør om:
   - INFORMASJONSSPØRSMÅL: Svar kort og informativt (1-3 setninger) UTEN å vise produkter
     Eksempler: "Hva er retinol?", "Er dette skadelig?", "Hvordan virker dette?"
   
   - PRODUKTFORESPØRSEL: Bruk show_products tool
     Eksempler: "Jeg har tørr hud", "Anbefal produkter", "Hva skal jeg bruke?", "Kjøpe julegave", "Vis meg produkter"

2. FOR INFORMASJONSSPØRSMÅL:
   - Gi konkret, nyttig informasjon
   - Hold det kort (1-3 setninger)
   - IKKE bruk show_products tool
   - Avslutt gjerne med "Vil du se produkter for dette?" hvis relevant

3. FOR PRODUKTFORESPØRSLER:
   - Gi en kort bekreftelse (1 setning)
   - BRUK show_products tool med category, reason og recommendedProductId
   - Velg ALLTID ETT spesifikt produkt som toppanbefaling

Produkt-IDer for anbefalinger:
Tørr hud: "1" (Hyaluronic Acid Serum - best), "2" (Rich Moisture Cream), "11" (Overnight Sleeping Mask)
Fet hud: "3" (Niacinamide Serum - best), "4" (Mattifying Day Cream), "13" (Clay Mask)
Anti-aging: "5" (Retinol Night Treatment - best), "6" (Peptide Eye Cream), "15" (Collagen Boosting Serum)
Akne: "7" (Salicylic Acid Cleanser - best), "8" (Spot Treatment), "17" (Tea Tree Spot Gel)

Produktkategorier:
- dry_skin: For tørr hud
- oily_skin: For fet hud
- anti_aging: For aldring og rynker
- acne: For akne og urenheter
- trending: Årets hotteste og mest trendy produkter (anbefal "5" Retinol)
- bestsellers: Bestselgere og mest populære (anbefal "1" Hyaluronic Acid)
- all_products: Vis alle produkter (anbefal "3" Niacinamide)

EKSEMPLER:

INFORMASJON (IKKE vis produkter):
Q: "Hva er retinol godt for?"
A: "Retinol er fantastisk for hudfornyelse! Det stimulerer kollagenproduksjon, reduserer fine linjer og rynker, og jevner ut hudtonen. Vil du se våre retinol-produkter?"

Q: "Er det farlig å bruke vitamin C og retinol sammen?"
A: "Bruk vitamin C om morgenen og retinol om kvelden - da unngår du irritasjon og får best effekt av begge!"

PRODUKTFORESPØRSEL (VIS produkter):
Q: "Jeg har tørr hud"
A: "Perfekt, jeg har noen fantastiske produkter for deg! 💧"
[show_products: dry_skin, recommendedProductId: "1"]

Q: "Kjøpe julegave til kona som har irritasjon"
A: "Så fint! Her er perfekte produkter for irritert hud! 💖"
[show_products: dry_skin, recommendedProductId: "2"]

Q: "Vis meg årets hotteste produkter"
A: "Her er årets mest trendy produkter! 🔥"
[show_products: trending, recommendedProductId: "5"]

Q: "Hva er mest populært nå?"
A: "Dette er våre bestselgere! ⭐"
[show_products: bestsellers, recommendedProductId: "1"]

Vær hjelpsom, personlig og balansert mellom informasjon og salg!`;

    let messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    if (imageUrl) {
      console.log('Analyzing skin image...');
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyser huden min grundig. Identifiser hudtype, eventuelle problemer som akne, tørrhet, fine linjer eller pigmentering. Gi meg konkrete produktanbefalinger med forklaring på hvordan de vil hjelpe min hud.'
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      });
    } else if (message) {
      console.log('Processing chat message:', message);
      messages.push({
        role: 'user',
        content: message
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Enten bilde eller melding er påkrevd' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add tool for product recommendations
    const tools = [
      {
        type: "function",
        function: {
          name: "show_products",
          description: "Bruk denne funksjonen NÅR kunden spør om produktanbefalinger, ønsker å handle, eller trenger hjelp til å velge produkter. IKKE bruk den når kunden bare stiller informasjonsspørsmål om hudpleie.",
          parameters: {
            type: "object",
            properties: {
              category: {
                type: "string",
                enum: ["dry_skin", "oily_skin", "anti_aging", "acne", "trending", "bestsellers", "all_products"],
                description: "Produktkategori: dry_skin (tørr hud), oily_skin (fet hud), anti_aging (aldring/rynker), acne (akne/urenheter), trending (årets hotteste), bestsellers (bestselgere), all_products (alle produkter)"
              },
              reason: {
                type: "string",
                description: "En kort, personlig forklaring på hvorfor akkurat disse produktene er perfekte for kunden (1-2 setninger)"
              },
              recommendedProductId: {
                type: "string",
                description: "ID for det ene produktet du anbefaler MEST for denne kundens behov. Dette produktet vil bli fremhevet. Velg basert på hudtype og problem."
              }
            },
            required: ["category", "reason", "recommendedProductId"]
          }
        }
      }
    ];

    console.log('Tools configured:', JSON.stringify(tools, null, 2));

    const requestBody = {
      model: 'google/gemini-2.5-flash',
      messages: messages,
      tools: tools,
    };

    console.log('Sending request to AI with tools enabled');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit nådd. Prøv igjen om litt.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Kreditter brukt opp. Legg til mer i Settings.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI Response:', JSON.stringify(data, null, 2));
    
    const aiMessage = data.choices?.[0]?.message;

    if (!aiMessage) {
      throw new Error('Ingen respons returnert fra AI');
    }

    let responseData: any = {
      text: aiMessage.content || ''
    };

    // Check if AI wants to show products
    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      const toolCall = aiMessage.tool_calls[0];
      console.log('Tool call detected:', JSON.stringify(toolCall, null, 2));
      
      if (toolCall.function.name === "show_products") {
        const args = JSON.parse(toolCall.function.arguments);
        responseData.showProducts = {
          category: args.category,
          reason: args.reason,
          recommendedProductId: args.recommendedProductId
        };
        console.log('AI requested to show products:', args);
        
        // If AI didn't provide text, generate a default message
        if (!responseData.text || responseData.text.trim() === '') {
          responseData.text = `La meg vise deg de perfekte produktene for ${args.reason}`;
          console.log('Generated default text as AI did not provide any');
        }
      }
    } else {
      console.log('No tool calls in AI response');
    }

    // Generate contextual follow-up suggestions based on response
    const suggestions: string[] = [];
    const responseText = responseData.text.toLowerCase();
    
    if (responseText.includes('retinol') || responseText.includes('rynker') || responseText.includes('aldring')) {
      suggestions.push('Hvordan bruke retinol?', 'Best på kvelden?', 'Kombinere med vitamin C?');
    } else if (responseText.includes('tørr') || responseText.includes('fuktig')) {
      suggestions.push('Beste fuktighetskrem?', 'Serum eller krem?', 'Morgendrutine for tørr hud');
    } else if (responseText.includes('akne') || responseText.includes('urenheter')) {
      suggestions.push('Forebygge kviser?', 'Produkter for fet hud', 'Behandle arrskader');
    } else if (responseText.includes('vitamin c') || responseText.includes('pigment')) {
      suggestions.push('Lyse opp huden?', 'Solbeskyttelse viktig?', 'Fade mørke flekker');
    } else if (responseData.showProducts) {
      // Generic follow-ups when showing products
      suggestions.push('Hvordan bruke dette?', 'Andre alternativer?', 'Resultater når?');
    }
    
    if (suggestions.length > 0) {
      responseData.suggestions = suggestions.slice(0, 3);
    }

    console.log('Final response data:', JSON.stringify(responseData, null, 2));

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-skin:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Ukjent feil' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
