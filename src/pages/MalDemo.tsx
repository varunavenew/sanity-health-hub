import { useParams, Link, Navigate, MemoryRouter, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import Fertility from "./treatments/Fertility";
import KvinnehelsePage from "./themes/KvinnehelsePage";
import GynekologiSubPage from "./treatments/GynekologiSubPage";
import ArticlePage from "./ArticlePage";

/**
 * MalDemo – mastermaler basert på eksisterende, godkjente sider.
 *
 * Hver mal renderer EKSAKT samme komponent som den ekte siden, slik at
 * det kunden ser her er en levende kopi av siden de allerede har godkjent.
 * Når en ny side skal lages av samme type, klones malen og innholdet
 * tilpasses – men strukturen og seksjonene er allerede på plass.
 */

type TemplateConfig = {
  title: string;
  description: string;
  livePath: string;
  render: () => JSX.Element;
};

const TEMPLATES: Record<string, TemplateConfig> = {
  treatmentCategory: {
    title: "Mal: Fagområde – Fertilitet",
    description:
      "Mastermal for hovedfagområder (Gynekologi, Fertilitet, Urologi). Bruker fertilitetssiden som den står i dag – den inneholder alle seksjonene en fagområdeside trenger.",
    livePath: "/behandlinger/fertilitet",
    render: () => <Fertility isChatOpen={false} />,
  },
  themePage: {
    title: "Mal: Temaside – Kvinnehelse",
    description:
      "Mastermal for tverrgående temaer (Kvinnehelse, Robotkirurgi, Tverrfaglige tilbud). Bruker kvinnehelse-siden som ferdig oppsett.",
    livePath: "/kvinnehelse",
    render: () => <KvinnehelsePage isChatOpen={false} />,
  },
  treatment: {
    title: "Mal: Underbehandling – Overgangsalder",
    description:
      "Mastermal for enkeltbehandlinger under et fagområde. Bruker overgangsalder-siden, som har alle seksjonene (hero, forløp, symptomer, løfter, relaterte, CTA) en underbehandling kan trenge.",
    livePath: "/behandlinger/gynekologi/overgangsalder",
    render: () => (
      <SubPageWithParams categoryPath="gynekologi" subId="overgangsalder" />
    ),
  },
  newsItem: {
    title: "Mal: Nyhet / Pasienthistorie",
    description:
      "Mastermal for nyheter og pasienthistorier i Aktuelt. Bruker en eksisterende publisert sak.",
    livePath: "/aktuelt/18-maneder-etter-hofteoperasjon-hos-cmedical",
    render: () => (
      <ArticleWithSlug slug="18-maneder-etter-hofteoperasjon-hos-cmedical" />
    ),
  },
  article: {
    title: "Mal: Fagartikkel",
    description:
      "Mastermal for lengre redaksjonelle fagartikler. Bruker en eksisterende fagartikkel fra Aktuelt.",
    livePath: "/aktuelt/overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe",
    render: () => (
      <ArticleWithSlug slug="overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe" />
    ),
  },
};

/** Render ArticlePage med en forhåndsvalgt slug, uavhengig av URL. */
function ArticleWithSlug({ slug }: { slug: string }) {
  return (
    <MemoryRouter initialEntries={[`/aktuelt/${slug}`]}>
      <Routes>
        <Route path="/aktuelt/:slug" element={<ArticlePage isChatOpen={false} />} />
      </Routes>
    </MemoryRouter>
  );
}

export default function MalDemo() {
  const { key = "" } = useParams();
  const mal = TEMPLATES[key];

  if (!mal) return <Navigate to="/godkjenning" replace />;

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Mal-banner */}
      <div className="bg-brand-dark text-brand-light sticky top-0 z-50">
        <div className="container mx-auto px-6 md:px-16 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm font-light min-w-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-light/10 text-xs uppercase tracking-wide shrink-0">
              Mastermal
            </span>
            <span className="truncate">{mal.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild size="sm" variant="ghost" className="text-brand-light hover:bg-brand-light/10 hidden sm:inline-flex">
              <Link to={mal.livePath} target="_blank" rel="noreferrer">
                Se live side ↗
              </Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link to="/godkjenning" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Tilbake
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Render den ekte siden som master */}
      {mal.render()}
    </div>
  );
}
