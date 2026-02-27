import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CMEDICAL_CONTEXT = `
Du er Liv, en vennlig AI-assistent for CMedical - Nordens ledende klinikk for livet og underlivet.

VIKTIG NAVIGASJONSPRINSIPP:
Når brukeren stiller et spørsmål, skal du ALLTID både svare OG navigere til relevant side.
Bruk formatet: [NAVIGATE:/path] i slutten av svaret ditt.

TILGJENGELIGE SIDER:
- / → Hjemmeside med booking-widget
- /om-oss → Om oss, våre verdier
- /tjenester → Oversikt over alle behandlingsområder
- /kontakt → Kontaktinfo og klinikker
- /forsikring → Informasjon om helseforsikring
- /behandlinger/gynekologi → Gynekologiske tjenester
- /behandlinger/fertilitet → Fertilitetstjenester
- /behandlinger/urologi → Urologiske tjenester
- /behandlinger/ortopedi → Ortopediske tjenester
- /behandlinger/flere-fagomrader → Andre spesialiteter

CMEDICAL INFORMASJON:
- 14 spesialistklinikker i Norge og Sverige
- Fagområder: Gynekologi, Fertilitet, Urologi, Ortopedi og flere
- Ingen henvisning nødvendig, kort ventetid
- 4.6 stjerner vurdering
- Tverrfaglige team med høyeste kompetanse
- Booking: https://cmedical.no/no/booking

BEHANDLINGSOMRÅDER:

GYNEKOLOGI:
- Generell gynekologisk undersøkelse
- Celleprøve og HPV-test
- Ultralyd og billeddiagnostikk
- Hormonelle forstyrrelser, PCOS, endometriose
- Prevensjonsveiledning og overgangsalder

FERTILITET:
- Fertilitetsutredning for kvinner og menn
- IVF og IUI behandling
- Eggfrysing og eggdonasjon
- Sædanalyse og behandling
- Personlig oppfølging gjennom hele prosessen

UROLOGI:
- Prostataundersøkelse og PSA-test
- Erektil dysfunksjon behandling
- Urinveisinfeksjoner og inkontinens
- Kirurgiske inngrep
- Mannshelse generelt

ORTOPEDI:
- Skulder, kne, hofte
- Idrettsskader
- Kirurgiske inngrep

KOMMUNIKASJONSSTIL:
- Svar KORT og konsist (maksimalt 2-3 setninger)
- ALLTID inkluder [NAVIGATE:/path] for å vise relevant side
- Forklar kort hva brukeren vil se på siden
- Vær varm, empatisk og profesjonell

NAVIGASJONSEKSEMPLER:
- "Jeg har smerter i underlivet" → "Det høres ut som du bør snakke med en av våre gynekologer. La meg vise deg våre behandlingsalternativer. [NAVIGATE:/behandlinger/gynekologi]"

- "Vi prøver å få barn" → "Vi tilbyr omfattende fertilitetsbehandling med personlig oppfølging. La meg vise deg våre tjenester. [NAVIGATE:/behandlinger/fertilitet]"

- "Hvor ligger klinikkene?" → "Vi har 14 klinikker i Norge og Sverige. La meg vise deg kontaktinfo. [NAVIGATE:/kontakt]"

- "Hvem er dere?" → "Vi er Nordens ledende private helsetilbud for livet og underlivet. La meg vise deg mer om oss. [NAVIGATE:/om-oss]"

- "Hvordan booker jeg time?" → "Du kan enkelt booke time på cmedical.no/no/booking. La meg vise deg hjemmesiden. [NAVIGATE:/]"

- "Hva koster behandlingen?" → "For priser, se vår prisside. La meg vise deg. [NAVIGATE:/priser]"

- "Har dere forsikringsavtaler?" → "Ja, vi samarbeider med flere forsikringsselskaper. La meg vise deg mer. [NAVIGATE:/forsikring]"

VIKTIG: ALLTID inkluder [NAVIGATE:/path] i ALLE svar, uansett spørsmål!
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Received chat request with message:', message);

    const messages = [
      { role: 'system', content: CMEDICAL_CONTEXT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Lovable AI error:', response.status, errorData);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            response: 'Beklager, vi har nådd grensen for antall forespørsler. Vennligst prøv igjen om litt.'
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: 'Payment required',
            response: 'Beklager, du må legge til kreditt i Lovable workspace. Gå til Settings -> Workspace -> Usage.'
          }),
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI response received');
    const aiText: string = data.choices?.[0]?.message?.content || '';

    // Post-process to guarantee navigation token
    const suggestPath = (t: string) => {
      const s = (t || '').toLowerCase();
      if (/(tilbakemeld|anmeld|review|stjerne|rating|vurdering)/.test(s)) return '/#tilbakemeldinger';
      if (/(gynekolog|gynekologi|kvinne|endometriose|pcos|celleprøve|livmor)/.test(s)) return '/behandlinger/gynekologi';
      if (/(fertilit|ivf|insemin|egg|gravid|donasjon)/.test(s)) return '/behandlinger/fertilitet';
      if (/(urolog|prostata|erektil|urinvei|inkontinens)/.test(s)) return '/behandlinger/urologi';
      if (/(ortoped|skulder|kne|hofte|idrett)/.test(s)) return '/behandlinger/ortopedi';
      if (/(andre|øvrig|flere|endo|hud|gastro)/.test(s)) return '/behandlinger/flere-fagomrader';
      if (/(kontakt|ring|telefon|klinikk|lokasjon|adresse|hvor)/.test(s)) return '/kontakt';
      if (/(om oss|hvem er|verdier|historie|spesialist)/.test(s)) return '/om-oss';
      if (/(forsikring|helseforsikring)/.test(s)) return '/forsikring';
      if (/(pris|kost|betale)/.test(s)) return '/priser';
      if (/(bestill|book|time|konsultasjon)/.test(s)) return '/';
      return '/';
    };

    const generateTags = (userMsg: string, aiReply: string) => {
      const combined = (userMsg + ' ' + aiReply).toLowerCase();
      const tags: Array<{label: string, path: string, category?: string}> = [];
      
      // Gynekologi hovedtag
      if (/(gynekolog|gynekologi|kvinne|endometriose|pcos|menstruasjon|livmor)/.test(combined)) {
        tags.push({ label: 'Gynekologi', path: '/behandlinger/gynekologi', category: 'main' });
        
        // Gynekologi undertags
        if (/(undersøkelse|sjekk|kontroll)/.test(combined)) {
          tags.push({ label: 'Gynekologiske undersøkelser', path: '/behandlinger/gynekologi#undersokelser' });
        }
        if (/(gravid|ultralyd|svangerskapskontroll)/.test(combined)) {
          tags.push({ label: 'Graviditet og ultralyd', path: '/behandlinger/gynekologi#ultralyd' });
        }
        if (/(prevensjon|spiral|p-pille|prevensjonsveiledning)/.test(combined)) {
          tags.push({ label: 'Prevensjon og spiral', path: '/behandlinger/gynekologi#prevensjon' });
        }
        if (/(celleprøve|hpv|underlivsplager)/.test(combined)) {
          tags.push({ label: 'Celleprøve og underlivsplager', path: '/behandlinger/gynekologi#celleprove' });
        }
        if (/(kirurgi|operasjon|inngrep)/.test(combined)) {
          tags.push({ label: 'Gynekologisk kirurgi', path: '/behandlinger/gynekologi#kirurgi' });
        }
      }
      
      // Fertilitet hovedtag
      if (/(fertilit|ivf|prøverør|gravid|eggdonasjon|inseminasjon|donorprogram|eggfrysing)/.test(combined)) {
        tags.push({ label: 'Fertilitet', path: '/behandlinger/fertilitet', category: 'main' });
        
        // Fertilitet undertags
        if (/(ivf|prøverør)/.test(combined)) {
          tags.push({ label: 'IVF-behandling', path: '/behandlinger/fertilitet#ivf' });
        }
        if (/(utredning|undersøkelse|test)/.test(combined)) {
          tags.push({ label: 'Fertilitetsutredning', path: '/behandlinger/fertilitet#utredning' });
        }
        if (/(eggfrysing|fryse egg)/.test(combined)) {
          tags.push({ label: 'Eggfrysing', path: '/behandlinger/fertilitet#eggfrysing' });
        }
        if (/(donor|eggdonasjon|sæddonasjon)/.test(combined)) {
          tags.push({ label: 'Donorprogram', path: '/behandlinger/fertilitet#donor' });
        }
        if (/(tidslinje|prosess|forløp|steg)/.test(combined)) {
          tags.push({ label: 'Tidslinje og prosess', path: '/behandlinger/fertilitet#prosess' });
        }
      }
      
      // Urologi hovedtag
      if (/(urolog|prostata|urinvei|inkontinens|erektil|mannlig|mann)/.test(combined)) {
        tags.push({ label: 'Urologi', path: '/behandlinger/urologi', category: 'main' });
        
        // Urologi undertags
        if (/(prostata|psa)/.test(combined)) {
          tags.push({ label: 'Prostata', path: '/behandlinger/urologi#prostata' });
        }
        if (/(inkontinens|lekkasje)/.test(combined)) {
          tags.push({ label: 'Inkontinens', path: '/behandlinger/urologi#inkontinens' });
        }
        if (/(urinvei|blærebetennelse|urinrør)/.test(combined)) {
          tags.push({ label: 'Urinveier', path: '/behandlinger/urologi#urinveier' });
        }
        if (/(infertilitet|sæd|sperm)/.test(combined)) {
          tags.push({ label: 'Mannlig infertilitet', path: '/behandlinger/urologi#infertilitet' });
        }
        if (/(kirurgi|operasjon|inngrep)/.test(combined)) {
          tags.push({ label: 'Urologisk kirurgi', path: '/behandlinger/urologi#kirurgi' });
        }
      }
      
      // Ortopedi hovedtag
      if (/(ortoped|skulder|kne|hofte|idrett|ledd|rygg)/.test(combined)) {
        tags.push({ label: 'Ortopedi', path: '/behandlinger/ortopedi', category: 'main' });
      }
      
      // Flere fagområder
      if (/(endo|hud|gastro|øre|nese|hals|andre|øvrig)/.test(combined)) {
        tags.push({ label: 'Flere fagområder', path: '/behandlinger/flere-fagomrader', category: 'main' });
      }
      
      // Priser
      if (/(pris|kost|betale)/.test(combined)) {
        tags.push({ label: 'Priser', path: '/priser', category: 'main' });
      }
      
      // Forsikring
      if (/(forsikring|helseforsikring|refusjon)/.test(combined)) {
        tags.push({ label: 'Forsikring', path: '/forsikring', category: 'main' });
      }
      
      // Spesialister
      if (/(lege|spesialist|kirurg|team|doktor)/.test(combined)) {
        tags.push({ label: 'Våre spesialister', path: '/om-oss#spesialister', category: 'main' });
      }
      
      // Klinikker
      if (/(klinikk|lokasjon|hvor|oslo|bergen|trondheim|stockholm|adresse)/.test(combined)) {
        tags.push({ label: 'Klinikker', path: '/kontakt#klinikker', category: 'main' });
        if (/oslo/.test(combined)) {
          tags.push({ label: 'Oslo', path: '/kontakt#oslo' });
        }
        if (/bergen/.test(combined)) {
          tags.push({ label: 'Bergen', path: '/kontakt#bergen' });
        }
        if (/trondheim/.test(combined)) {
          tags.push({ label: 'Trondheim', path: '/kontakt#trondheim' });
        }
        if (/stockholm/.test(combined)) {
          tags.push({ label: 'Stockholm', path: '/kontakt#stockholm' });
        }
      }
      
      // Booking og kontakt
      if (/(time|bestill|book|avtale|konsultasjon|avbestill|åpningstid|kontakt)/.test(combined)) {
        if (!tags.some(t => t.label === 'Klinikker')) {
          tags.push({ label: 'Book time', path: '/kontakt', category: 'main' });
        }
        if (/(avbestill|kanseller)/.test(combined)) {
          tags.push({ label: 'Avbestill time', path: '/kontakt#avbestilling' });
        }
        if (/(åpningstid|åpningstider|åpent)/.test(combined)) {
          tags.push({ label: 'Åpningstider', path: '/kontakt#apningstider' });
        }
      }
      
      // Generelle tema
      if (/(symptom|behandling|diagnose|informasjon|spørsmål|faq)/.test(combined)) {
        if (/(symptom)/.test(combined)) {
          tags.push({ label: 'Symptomer', path: '/guide#symptomer' });
        }
        if (/(faq|ofte stilte|spørsmål)/.test(combined)) {
          tags.push({ label: 'Ofte stilte spørsmål', path: '/om-oss#faq' });
        }
      }
      
      // Om CMedical
      if (/(om oss|hvem er|historie|verdier|cmedical|c-medical)/.test(combined)) {
        if (!tags.some(t => t.label === 'Våre spesialister')) {
          tags.push({ label: 'Om CMedical', path: '/om-oss', category: 'main' });
        }
      }
      
      // Remove duplicates and limit to max 5 tags
      const uniqueTags = tags.filter((tag, index, self) => 
        index === self.findIndex(t => t.label === tag.label)
      );
      
      return uniqueTags.slice(0, 5);
    };

    const hasNavigate = /\[NAVIGATE:.*?\]/.test(aiText);
    const path = suggestPath(message);
    const finalText = hasNavigate ? aiText : `${aiText} [NAVIGATE:${path}]`;
    const tags = generateTags(message, aiText);

    return new Response(
      JSON.stringify({ 
        response: finalText,
        tags: tags 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        response: 'Beklager, jeg opplever tekniske problemer. Vennligst prøv igjen.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
