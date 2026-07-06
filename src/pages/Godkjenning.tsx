import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Clock, MessageSquare, Search, Download, Inbox, ListChecks, Calendar, Sparkles, Plus, LayoutTemplate, Eye, CalendarClock, Stethoscope } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { sitePages, type SitePage } from "@/data/sitePages";
import { AccessGate } from "@/components/AccessGate";
import { toast } from "@/hooks/use-toast";
import { ChangeRequestDialog } from "@/components/godkjenning/ChangeRequestDialog";
import { ChangeRequestInbox, type ChangeRequest } from "@/components/godkjenning/ChangeRequestInbox";
import { FremdriftsplanPanel } from "@/components/godkjenning/FremdriftsplanPanel";

// Mastermaler vises som komplette demo-sider med ALLE seksjonstyper samlet,
// slik at kunden kan godkjenne hele malen før innholdet tilpasses per side.
const MASTER_TEMPLATES: {
  key: string;
  title: string;
  description: string;
  examplePath: string;
  exampleLabel: string;
}[] = [
  {
    key: "treatmentCategory",
    title: "Fagområde",
    description: "Hovedkategori (Gynekologi, Fertilitet, Urologi). Komplett mal med hero, intro, stats, tjenester, prosess, accordion, FAQ og CTA.",
    examplePath: "/maler/treatmentCategory",
    exampleLabel: "Åpne komplett mal",
  },
  {
    key: "themePage",
    title: "Temaside",
    description: "Tverrgående tema (Kvinnehelse, Robotkirurgi). Fleksibel seksjonsoppbygging med rik tekst, lenker, stats og CTA.",
    examplePath: "/maler/themePage",
    exampleLabel: "Åpne komplett mal",
  },
  {
    key: "treatment",
    title: "Underbehandling",
    description: "Enkeltbehandling under et fagområde. Fordeler, prosess, pasientreise, accordion, FAQ og CTA.",
    examplePath: "/maler/treatment",
    exampleLabel: "Åpne komplett mal",
  },
  {
    key: "articleUnified",
    title: "Artikkel",
    description: "Felles mastermal for alt redaksjonelt innhold i Aktuelt — pasienthistorier, fagartikler, nyheter og klinikknytt. Kategori-badge skiller typene.",
    examplePath: "/maler/articleUnified",
    exampleLabel: "Åpne mal",
  },
  {
    key: "specialistProfile",
    title: "Spesialistprofil",
    description: "Mastermal for spesialistprofiler. Brukes når en ny spesialist skal legges inn — siden bygges automatisk fra spesialistens data.",
    examplePath: "/maler/specialistProfile",
    exampleLabel: "Åpne mal",
  },
  {
    key: "treatmentCategoryForrigeUke",
    title: "Fagområde – versjon fra 10. juni (forrige uke)",
    description: "Snapshot av fagområde-mastermalen slik den så ut for ca. én uke siden. Brukes for å sammenligne med dagens versjon.",
    examplePath: "/maler/treatmentCategoryForrigeUke",
    exampleLabel: "Åpne tidligere versjon",
  },
  {
    key: "treatmentCategoryToUkerSiden",
    title: "Fagområde – versjon fra 2. juni (~2 uker siden)",
    description: "Snapshot av fagområde-mastermalen (gynekologi) slik den så ut for ca. to uker siden. Brukes for å sammenligne med dagens versjon.",
    examplePath: "/maler/treatmentCategoryToUkerSiden",
    exampleLabel: "Åpne tidligere versjon",
  },
  {
    key: "fertilitetEtterMaster",
    title: "Demo: Fertilitet bygget på mastermalen",
    description: "Fertilitet satt opp etter den godkjente mastermalen (2. juni-snapshot). Identisk struktur og design som mastermalen — kun innhold er fertilitetsspesifikt (tekst, hero-video, 'fra'-pris, bilder, spesialister).",
    examplePath: "/maler/fertilitetEtterMaster",
    exampleLabel: "Åpne demo",
  },
  {
    key: "fertilitetVarmHeroForslag",
    title: "Fertilitet – varm hero (forslag)",
    description: "Forslag til redesignet Fertilitet-hero med mer varme og farge: split-hero der hero-bildet ligger ved siden av et varmt korn-gradient-panel (korall/oransje/fersken/varm brun), med små korn-gradient-flater som aksenter rundt hero for ekstra dybde. Samme tokens, typografi, radius og USP-stil som resten av siden. Kun demo — den publiserte Fertilitet-siden er uendret.",
    examplePath: "/maler/fertilitetVarmHeroForslag",
    exampleLabel: "Åpne forslag",
  },
  {
    key: "fagomradeHeroVarianter",
    title: "Fagområde – hero-varianter (5 innganger)",
    description: "Fem hero-varianter for hovedfagområde-siden (kategori-hero), stablet under hverandre og merket Variant 1–5. Samme varme korn-gradient-retning som fertilitet-forslagene: varm split, full gradient-blokk, sentrert med stor korn-bakgrunn, asymmetrisk bilde+gradient, og ren/minimal. Ekte innhold fra Gynekologi/Fertilitet/Urologi. Kun demo — publiserte sider er uendret.",
    examplePath: "/maler/fagomradeHeroVarianter",
    exampleLabel: "Åpne varianter",
  },
];

const DEMO_GROUPS: { title: string; items: { to: string; name: string }[] }[] = [
  {
    title: "Gynekologi",
    items: [
      { to: "/gynekologi-design/editorial", name: "Gynekologi — Editorial" },
      { to: "/gynekologi-design/journey", name: "Gynekologi — Reisen" },
      { to: "/gynekologi-design/atelier", name: "Gynekologi — Atelier" },
      { to: "/gynekologi-design/index", name: "Gynekologi — Index" },
      { to: "/gynekologi-design/klassisk-plus", name: "Gynekologi — Klassisk+" },
    ],
  },
  {
    title: "Fertilitet",
    items: [
      { to: "/fertilitet-design/fertilitet/editorial", name: "Fertilitet — Editorial" },
      { to: "/fertilitet-design/fertilitet/journey", name: "Fertilitet — Reisen" },
      { to: "/fertilitet-design/fertilitet/atelier", name: "Fertilitet — Atelier" },
      { to: "/fertilitet-design/fertilitet/dialog", name: "Fertilitet — Dialog" },
      { to: "/fertilitet-design/fertilitet/magasin", name: "Fertilitet — Magasin" },
      { to: "/fertilitet-design/fertilitet/klinikk", name: "Fertilitet — Klinikk" },
    ],
  },
  {
    title: "Fertilitetssjekk",
    items: [
      { to: "/fertilitet-design/fertilitetssjekk/editorial", name: "Fertilitetssjekk — Editorial" },
      { to: "/fertilitet-design/fertilitetssjekk/journey", name: "Fertilitetssjekk — Reisen" },
      { to: "/fertilitet-design/fertilitetssjekk/atelier", name: "Fertilitetssjekk — Atelier" },
      { to: "/fertilitet-design/fertilitetssjekk/dialog", name: "Fertilitetssjekk — Dialog" },
      { to: "/fertilitet-design/fertilitetssjekk/magasin", name: "Fertilitetssjekk — Magasin" },
      { to: "/fertilitet-design/fertilitetssjekk/klinikk", name: "Fertilitetssjekk — Klinikk" },
    ],
  },
  {
    title: "Spesialistprofil",
    items: [
      { to: "/spesialist-design/editorial", name: "Spesialist — Forslag 1" },
      { to: "/spesialist-design/klinisk", name: "Spesialist — Forslag 2" },
      { to: "/spesialist-design/atelier", name: "Spesialist — Forslag 3" },
    ],
  },
  {
    title: "Seksjoner",
    items: [
      { to: "/demoer/tips", name: "Tips / «Vill du veta mer?» — 3 varianter" },
      { to: "/demoer/spesialister-layout", name: "Spesialister — 1 / 2 / 3 / 4+ layout" },
    ],
  },
  {
    title: "Hjemmeside",
    items: [
      { to: "/hjem-demo/lek", name: "Hjem — Lekekasse (kopi)" },
      { to: "/hjem-demo/editorial", name: "Hjem — Editorial (forslag 1)" },
      { to: "/hjem-demo/kompakt", name: "Hjem — Kompakt (forslag 2)" },
      { to: "/hjem-demo/fortelling", name: "Hjem — Fortelling (forslag 3)" },
    ],
  },
  {
    title: "Priser",
    items: [
      { to: "/demoer/priser-inline-info", name: "Priser — Info under tjenesten (demo)" },
      { to: "/demoer/priser-kategorikort", name: "Priser — Kategorikort (forslag 1)" },
      { to: "/demoer/priser-magasin", name: "Priser — Magasin (forslag 2)" },
      { to: "/demoer/priser-spotlight", name: "Priser — Spotlight (forslag 3)" },
    ],
  },
];

const malPath = (key: string) => `__mal_${key}__`;

type Status = "godkjent" | "avventer" | "endringer";

const BOOKING_PATH = "__booking__";
const GENERAL_PATH = "__generelt__";
const PSEUDO_PATHS = [BOOKING_PATH, GENERAL_PATH];

interface ApprovalRow {
  path: string;
  status: Status;
  comment: string;
  updated_at: string;
  updated_by: string;
}

const STATUS_META: Record<Status, { label: string; bg: string; dot: string }> = {
  godkjent: { label: "Godkjent", bg: "bg-emerald-50 text-emerald-900 border-emerald-200", dot: "bg-emerald-500" },
  avventer: { label: "Avventer", bg: "bg-amber-50 text-amber-900 border-amber-200", dot: "bg-amber-500" },
  endringer: { label: "Endringer ønskes", bg: "bg-rose-50 text-rose-900 border-rose-200", dot: "bg-rose-500" },
};

const STORAGE_REVIEWER = "cm_approval_reviewer";

const TabBtn = ({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
      active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {icon} {label}
    {badge && badge > 0 ? (
      <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-background text-foreground" : "bg-rose-100 text-rose-900"}`}>
        {badge}
      </span>
    ) : null}
  </button>
);

const FeedbackPanel = ({
  title,
  description,
  requests,
  reviewer,
  onNew,
}: {
  title: string;
  description: string;
  requests: ChangeRequest[];
  reviewer: string;
  onNew: () => void;
}) => (
  <div>
    <div className="flex items-start justify-between gap-4 flex-wrap mb-6 pb-4 border-b border-border">
      <div>
        <h2 className="text-xl font-light text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xl font-light">{description}</p>
      </div>
      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-sm rounded-md hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" /> Ny tilbakemelding
      </button>
    </div>
    {requests.length === 0 ? (
      <div className="border border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-sm text-muted-foreground">Ingen tilbakemeldinger ennå. Klikk «Ny tilbakemelding» for å registrere første.</p>
      </div>
    ) : (
      <ChangeRequestInbox requests={requests} reviewer={reviewer} />
    )}
  </div>
);

const Godkjenning = () => {
  const [rows, setRows] = useState<Record<string, ApprovalRow>>({});
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewer, setReviewer] = useState("");
  const [filter, setFilter] = useState<"alle" | Status>("alle");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"sider" | "tjenester" | "innboks" | "booking" | "generelt" | "maler" | "demo" | "fremdrift">("sider");
  const [dialogPage, setDialogPage] = useState<SitePage | null>(null);

  useEffect(() => {
    document.title = "Godkjenning av sider · CMedical";
    try {
      const saved = localStorage.getItem(STORAGE_REVIEWER);
      if (saved) setReviewer(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const load = async () => {
      const [{ data: appData, error: appErr }, { data: reqData, error: reqErr }] = await Promise.all([
        supabase.from("page_approvals").select("*"),
        supabase.from("change_requests").select("*").order("created_at", { ascending: false }),
      ]);
      if (appErr) toast({ title: "Kunne ikke laste sider", description: appErr.message, variant: "destructive" });
      if (reqErr) toast({ title: "Kunne ikke laste forespørsler", description: reqErr.message, variant: "destructive" });

      if (appData) {
        const map: Record<string, ApprovalRow> = {};
        appData.forEach((r: any) => { map[r.path] = r; });
        setRows(map);
      }
      if (reqData) setRequests(reqData as any);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("godkjenning_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "page_approvals" }, (payload: any) => {
        if (payload.new?.path) setRows((prev) => ({ ...prev, [payload.new.path]: payload.new }));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "change_requests" }, (payload: any) => {
        setRequests((prev) => {
          if (payload.eventType === "DELETE") return prev.filter((r) => r.id !== payload.old.id);
          const next = payload.new as ChangeRequest;
          const idx = prev.findIndex((r) => r.id === next.id);
          if (idx === -1) return [next, ...prev];
          const copy = [...prev];
          copy[idx] = next;
          return copy;
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const persistReviewer = (name: string) => {
    setReviewer(name);
    try { localStorage.setItem(STORAGE_REVIEWER, name); } catch {}
  };

  const updateRow = async (page: SitePage, patch: Partial<Pick<ApprovalRow, "status" | "comment">>) => {
    const existing = rows[page.path];
    const next: ApprovalRow = {
      path: page.path,
      status: (patch.status ?? existing?.status ?? "avventer") as Status,
      comment: patch.comment ?? existing?.comment ?? "",
      updated_at: new Date().toISOString(),
      updated_by: reviewer || existing?.updated_by || "",
    };
    setRows((prev) => ({ ...prev, [page.path]: next }));
    const { error } = await supabase.from("page_approvals").upsert({
      path: page.path,
      name: page.name,
      category: page.category,
      status: next.status,
      comment: next.comment,
      updated_by: next.updated_by,
    });
    if (error) toast({ title: "Kunne ikke lagre", description: error.message, variant: "destructive" });
  };

  const openRequestDialog = (page: SitePage) => {
    // Also flip status to "endringer" so it shows up in overview
    if (rows[page.path]?.status !== "endringer") {
      updateRow(page, { status: "endringer" });
    }
    setDialogPage(page);
  };

  const requestCountByPath = useMemo(() => {
    const m: Record<string, { open: number; total: number }> = {};
    requests.forEach((r) => {
      if (!m[r.page_path]) m[r.page_path] = { open: 0, total: 0 };
      m[r.page_path].total++;
      if (r.status !== "ferdig") m[r.page_path].open++;
    });
    return m;
  }, [requests]);

  const isServiceCategory = (category: string) =>
    category === "Fagområder" || category.includes("underbehandlinger");

  const grouped = useMemo(() => {
    // Both "sider" and "tjenester" (nå "Innholdgodkjenning") lister ALLE sider samlet.
    const source = sitePages;
    const filtered = source.filter((p) => {
      const r = rows[p.path];
      const status = (r?.status ?? "avventer") as Status;
      if (filter !== "alle" && status !== filter) return false;
      if (search && !`${p.name} ${p.path}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    const map = new Map<string, SitePage[]>();
    filtered.forEach((p) => {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    });
    return Array.from(map.entries());
  }, [rows, filter, search, tab]);

  const serviceCounts = useMemo(() => {
    const services = sitePages.filter((p) => isServiceCategory(p.category));
    const c = { total: services.length, godkjent: 0, avventer: 0, endringer: 0 };
    services.forEach((p) => {
      const s = (rows[p.path]?.status ?? "avventer") as Status;
      c[s]++;
    });
    return c;
  }, [rows]);


  const counts = useMemo(() => {
    const c = { total: sitePages.length, godkjent: 0, avventer: 0, endringer: 0 };
    sitePages.forEach((p) => {
      const s = (rows[p.path]?.status ?? "avventer") as Status;
      c[s]++;
    });
    return c;
  }, [rows]);

  const pageRequests = useMemo(() => requests.filter((r) => !PSEUDO_PATHS.includes(r.page_path)), [requests]);
  const bookingRequests = useMemo(() => requests.filter((r) => r.page_path === BOOKING_PATH), [requests]);
  const generalRequests = useMemo(() => requests.filter((r) => r.page_path === GENERAL_PATH), [requests]);
  const openRequestsCount = useMemo(() => pageRequests.filter((r) => r.status !== "ferdig").length, [pageRequests]);
  const openBookingCount = useMemo(() => bookingRequests.filter((r) => r.status !== "ferdig").length, [bookingRequests]);
  const openGeneralCount = useMemo(() => generalRequests.filter((r) => r.status !== "ferdig").length, [generalRequests]);

  const exportCsv = () => {
    const header = ["Kategori", "Side", "URL", "Status", "Kommentar", "Åpne endringer", "Sist oppdatert", "Av"];
    const lines = sitePages.map((p) => {
      const r = rows[p.path];
      const status = (r?.status ?? "avventer") as Status;
      const reqs = requestCountByPath[p.path];
      const cells = [
        p.category,
        p.name,
        p.path,
        STATUS_META[status].label,
        (r?.comment ?? "").replace(/\s+/g, " "),
        reqs ? `${reqs.open}/${reqs.total}` : "0/0",
        r?.updated_at ?? "",
        r?.updated_by ?? "",
      ];
      return cells.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",");
    });
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `godkjenning-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 md:px-12 py-8 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-light text-foreground">Godkjenning av sider</h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl font-light">
            Gå gjennom hver side, sett status og send konkrete endringsforespørsler med vedlegg.
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Totalt" value={counts.total} />
            <StatCard label="Godkjent" value={counts.godkjent} accent="emerald" />
            <StatCard label="Avventer" value={counts.avventer} accent="amber" />
            <StatCard label="Endringer" value={counts.endringer} accent="rose" />
            <StatCard label="Åpne forespørsler" value={openRequestsCount} accent="rose" />
          </div>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-1 text-sm border border-border rounded-md p-1 bg-background flex-wrap">
              <TabBtn active={tab === "sider"} onClick={() => setTab("sider")} icon={<ListChecks className="w-4 h-4" />} label="Sider" />
              <TabBtn
                active={tab === "tjenester"}
                onClick={() => setTab("tjenester")}
                icon={<Stethoscope className="w-4 h-4" />}
                label="Tjenester"
                badge={serviceCounts.avventer + serviceCounts.endringer}
              />
              <TabBtn active={tab === "innboks"} onClick={() => setTab("innboks")} icon={<Inbox className="w-4 h-4" />} label="Endringer" badge={openRequestsCount} />
              <TabBtn active={tab === "booking"} onClick={() => setTab("booking")} icon={<Calendar className="w-4 h-4" />} label="Booking" badge={openBookingCount} />
              <TabBtn active={tab === "generelt"} onClick={() => setTab("generelt")} icon={<Sparkles className="w-4 h-4" />} label="Generelt" badge={openGeneralCount} />
              <TabBtn active={tab === "maler"} onClick={() => setTab("maler")} icon={<LayoutTemplate className="w-4 h-4" />} label="Maler" />
              <TabBtn active={tab === "demo"} onClick={() => setTab("demo")} icon={<Eye className="w-4 h-4" />} label="Demo" />
              <TabBtn active={tab === "fremdrift"} onClick={() => setTab("fremdrift")} icon={<CalendarClock className="w-4 h-4" />} label="Fremdriftsplan" />
            </div>

            <div className="flex gap-2 items-center">
              <input
                value={reviewer}
                onChange={(e) => persistReviewer(e.target.value)}
                placeholder="Ditt navn"
                className="border border-border bg-background px-3 py-2 text-sm rounded-md w-40 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
            </div>
          </div>

          {(tab === "sider" || tab === "tjenester") && (
            <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center">
              <div className="relative md:max-w-xs flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Søk side eller URL"
                  className="w-full border border-border bg-background pl-9 pr-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="flex gap-1 text-xs">
                {(["alle", "avventer", "endringer", "godkjent"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 rounded-md border transition-colors ${
                      filter === f ? "bg-foreground text-background border-foreground" : "bg-background text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {f === "alle" ? "Alle" : STATUS_META[f].label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-12 py-10 max-w-6xl">
        {loading ? (
          <p className="text-sm text-muted-foreground">Laster…</p>
        ) : tab === "innboks" ? (
          <ChangeRequestInbox requests={pageRequests} reviewer={reviewer} />
        ) : tab === "booking" ? (
          <FeedbackPanel
            title="Booking"
            description="Tilbakemeldinger som gjelder bookingflyt, kalender, bekreftelser og betaling."
            requests={bookingRequests}
            reviewer={reviewer}
            onNew={() => setDialogPage({ path: BOOKING_PATH, name: "Booking", category: "Generelt" } as SitePage)}
          />
        ) : tab === "generelt" ? (
          <FeedbackPanel
            title="Generelle tilbakemeldinger"
            description="Overordnede tilbakemeldinger som ikke hører til en spesifikk side."
            requests={generalRequests}
            reviewer={reviewer}
            onNew={() => setDialogPage({ path: GENERAL_PATH, name: "Generelt", category: "Generelt" } as SitePage)}
          />
        ) : tab === "maler" ? (
          <MasterTemplatesPanel
            rows={rows}
            requestCountByPath={requestCountByPath}
            onSetStatus={(key, label, status) =>
              updateRow({ path: malPath(key), name: `Mal: ${label}`, category: "Maler" } as SitePage, { status })
            }
            onRequestChanges={(key, label) =>
              openRequestDialog({ path: malPath(key), name: `Mal: ${label}`, category: "Maler" } as SitePage)
            }
            onJumpToInbox={() => setTab("innboks")}
          />
        ) : tab === "demo" ? (
          <DemoPanel />
        ) : tab === "fremdrift" ? (
          <FremdriftsplanPanel />
        ) : grouped.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ingen sider matcher filteret.</p>
        ) : (
          <div className="space-y-12">
            {tab === "tjenester" && (
              <div className="pb-6 border-b border-border">
                <h2 className="text-xl font-light text-foreground">Tjenester og undertjenester</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl font-light">
                  Alle hovedtjenester (fagområder) og tilhørende undertjenester. Klikk en side for å lese den, sett status
                  og skriv kommentarer — endringene lagres for hele teamet.
                </p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard label="Totalt" value={serviceCounts.total} />
                  <StatCard label="Godkjent" value={serviceCounts.godkjent} accent="emerald" />
                  <StatCard label="Avventer" value={serviceCounts.avventer} accent="amber" />
                  <StatCard label="Endringer" value={serviceCounts.endringer} accent="rose" />
                </div>
              </div>
            )}
            {grouped.map(([category, pages]) => (
              <section key={category}>
                <div className="mb-5 flex items-baseline justify-between gap-3 pb-3 border-b border-border">
                  <h2 className="text-lg font-light text-foreground">{category}</h2>
                  <span className="text-xs text-muted-foreground">{pages.length} {pages.length === 1 ? "side" : "sider"}</span>
                </div>
                <div className="grid gap-4">
                  {pages.map((page) => (
                    <PageApprovalCard
                      key={page.path}
                      page={page}
                      row={rows[page.path]}
                      reqs={requestCountByPath[page.path]}
                      reviewer={reviewer}
                      onReviewerChange={persistReviewer}
                      onStatus={(status) => updateRow(page, { status })}
                      onSaveComment={(comment) => updateRow(page, { comment })}
                      onRequestChanges={() => openRequestDialog(page)}
                      onJumpToInbox={() => setTab("innboks")}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {dialogPage && (
        <ChangeRequestDialog
          open={!!dialogPage}
          onClose={() => setDialogPage(null)}
          pagePath={dialogPage.path}
          pageName={dialogPage.name}
          reviewer={reviewer}
        />
      )}
    </div>
  );
};
const PageApprovalCard = ({
  page,
  row,
  reqs,
  reviewer,
  onReviewerChange,
  onStatus,
  onSaveComment,
  onRequestChanges,
  onJumpToInbox,
}: {
  page: SitePage;
  row?: ApprovalRow;
  reqs?: { open: number; total: number };
  reviewer: string;
  onReviewerChange: (name: string) => void;
  onStatus: (status: Status) => void;
  onSaveComment: (comment: string) => void;
  onRequestChanges: () => void;
  onJumpToInbox: () => void;
}) => {
  const status = (row?.status ?? "avventer") as Status;
  const savedComment = row?.comment ?? "";
  const [draft, setDraft] = useState(savedComment);
  const [localName, setLocalName] = useState(reviewer);

  useEffect(() => { setDraft(savedComment); }, [savedComment]);
  useEffect(() => { setLocalName(reviewer); }, [reviewer]);

  const dirty = draft !== savedComment;

  const StatusButton = ({ value, label, icon }: { value: Status; label: string; icon?: React.ReactNode }) => {
    const active = status === value;
    const onClick = value === "endringer" ? onRequestChanges : () => onStatus(value);
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-md border transition-colors flex-1 md:flex-none ${
          active
            ? `${STATUS_META[value].bg} border-transparent font-normal`
            : "border-border text-muted-foreground hover:text-foreground hover:bg-muted bg-background"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_META[value].dot}`} />
        {icon}
        {label}
      </button>
    );
  };

  return (
    <article className="border border-border rounded-lg bg-card overflow-hidden">
      {/* Header: page identity */}
      <div className="p-5 md:p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <Link
              to={page.path}
              className="group inline-flex items-center gap-1.5 text-base md:text-lg font-light text-foreground hover:underline underline-offset-4"
            >
              {page.name}
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
            </Link>
            <p className="text-xs text-muted-foreground mt-1 font-mono truncate">{page.path}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border ${STATUS_META[status].bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_META[status].dot}`} />
              {STATUS_META[status].label}
            </span>
            {reqs && reqs.open > 0 && (
              <button
                onClick={onJumpToInbox}
                className="text-[11px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100"
              >
                {reqs.open} åpne {reqs.open === 1 ? "endring" : "endringer"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status buttons */}
      <div className="px-5 md:px-6 pt-5">
        <p className="text-[11px] uppercase tracking-normal text-muted-foreground mb-2">Status</p>
        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <StatusButton value="godkjent" label="Godkjent" icon={<Check className="w-3.5 h-3.5" />} />
          <StatusButton value="avventer" label="Avventer" icon={<Clock className="w-3.5 h-3.5" />} />
          <StatusButton value="endringer" label="Endringer ønskes" icon={<MessageSquare className="w-3.5 h-3.5" />} />
        </div>
      </div>

      {/* Comment area */}
      <div className="p-5 md:p-6 pt-5">
        <label className="block">
          <span className="text-[11px] uppercase tracking-normal text-muted-foreground">Kommentar / notis</span>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Skriv en lengre tilbakemelding for «${page.name}» — hva som fungerer, hva som mangler, hva som bør endres. Bruk «Endringer ønskes» for konkrete oppgaver med vedlegg.`}
            rows={6}
            className="mt-2 block w-full border border-border bg-background px-4 py-3 text-sm rounded-md leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y min-h-[140px]"
          />
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <label className="text-[11px] uppercase text-muted-foreground shrink-0">Navn</label>
            <input
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={() => { if (localName !== reviewer) onReviewerChange(localName); }}
              placeholder="Ditt navn"
              className="flex-1 min-w-0 border border-border bg-background px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex items-center gap-2">
            {dirty && (
              <button
                type="button"
                onClick={() => setDraft(savedComment)}
                className="text-xs px-3 py-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                Avbryt
              </button>
            )}
            <button
              type="button"
              disabled={!dirty}
              onClick={() => {
                if (localName && localName !== reviewer) onReviewerChange(localName);
                onSaveComment(draft);
              }}
              className={`inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-md transition-opacity ${
                dirty ? "bg-foreground text-background hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {dirty ? "Lagre kommentar" : "Lagret"}
            </button>
          </div>
        </div>

        {row?.updated_at && (
          <p className="text-[11px] text-muted-foreground mt-3 inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Sist oppdatert {new Date(row.updated_at).toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" })}
            {row.updated_by ? ` · ${row.updated_by}` : ""}
          </p>
        )}
      </div>
    </article>
  );
};


const MasterTemplatesPanel = ({
  rows,
  requestCountByPath,
  onSetStatus,
  onRequestChanges,
  onJumpToInbox,
}: {
  rows: Record<string, ApprovalRow>;
  requestCountByPath: Record<string, { open: number; total: number }>;
  onSetStatus: (key: string, label: string, status: Status) => void;
  onRequestChanges: (key: string, label: string) => void;
  onJumpToInbox: () => void;
}) => {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-xl font-light text-foreground">Mastermaler</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl font-light">
          Hver mal er bygget og kan brukes om igjen til mange sider. Åpne eksempelet for å se hvordan malen ser ut i bruk,
          og marker som godkjent eller be om endringer.
        </p>
      </div>

      <ul className="grid md:grid-cols-2 gap-4">
        {MASTER_TEMPLATES.map((t) => {
          const path = malPath(t.key);
          const row = rows[path];
          const status = (row?.status ?? "avventer") as Status;
          const reqs = requestCountByPath[path];
          return (
            <li key={t.key} className="border border-border rounded-lg p-5 bg-background">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-light text-foreground">{t.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Eksempel: {t.exampleLabel}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-2xl md:rounded-full border ${STATUS_META[status].bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-2xl ${STATUS_META[status].dot}`} />
                  {STATUS_META[status].label}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mt-3 font-light leading-relaxed">{t.description}</p>

              {reqs && reqs.open > 0 && (
                <button
                  onClick={onJumpToInbox}
                  className="mt-3 text-[11px] px-2 py-0.5 rounded-2xl md:rounded-full bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100"
                >
                  {reqs.open} åpne {reqs.open === 1 ? "endring" : "endringer"}
                </button>
              )}

              <div className="mt-4 flex gap-2 flex-wrap">
                <Link
                  to={t.examplePath}
                  className="inline-flex items-center gap-1.5 bg-foreground text-background text-xs px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
                >
                  Se eksempel <ArrowUpRight className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => onSetStatus(t.key, t.title, "godkjent")}
                  className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                    status === "godkjent" ? `${STATUS_META.godkjent.bg} border-transparent` : "border-border text-muted-foreground hover:text-foreground bg-background"
                  }`}
                >
                  <Check className="inline w-3 h-3 mr-1" />Godkjenn mal
                </button>
                <button
                  onClick={() => onRequestChanges(t.key, t.title)}
                  className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                    status === "endringer" ? `${STATUS_META.endringer.bg} border-transparent` : "border-border text-muted-foreground hover:text-foreground bg-background"
                  }`}
                >
                  <MessageSquare className="inline w-3 h-3 mr-1" />Be om endring
                </button>
              </div>

              {row?.updated_at && (
                <p className="text-[11px] text-muted-foreground mt-3 inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(row.updated_at).toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" })}
                  {row.updated_by ? ` · ${row.updated_by}` : ""}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const StatCard = ({ label, value, accent }: { label: string; value: number; accent?: "emerald" | "amber" | "rose" }) => {
  const accents: Record<string, string> = {
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    rose: "text-rose-700",
  };
  return (
    <div className="border border-border bg-background rounded-lg px-4 py-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`text-2xl font-light mt-1 ${accent ? accents[accent] : "text-foreground"}`}>{value}</p>
    </div>
  );
};

const DemoPanel = () => (
  <div>
    <div className="mb-6 pb-4 border-b border-border">
      <h2 className="text-xl font-light text-foreground">Demo</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-2xl font-light">
        Alle designforslag samlet på ett sted. Klikk en variant for å se den i full visning i en ny fane.
      </p>
    </div>

    <div className="space-y-12">
      {DEMO_GROUPS.map((g) => (
        <section key={g.title}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h3 className="text-base font-light text-foreground">{g.title}</h3>
          </div>
          <ul className="divide-y divide-border/60">
            {g.items.map((it) => (
              <li key={it.to}>
                <Link
                  to={it.to}
                  className="group flex items-center justify-between py-4 hover:px-2 transition-all duration-300"
                >
                  <span className="text-sm md:text-base font-light text-foreground">{it.name}</span>
                  <ArrowUpRight
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </div>
);


const GodkjenningPage = () => (
  <AccessGate>
    <Godkjenning />
  </AccessGate>
);

export default GodkjenningPage;
