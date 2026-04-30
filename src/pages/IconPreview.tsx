import { ICONS, getIcon, type IconName } from "@/lib/icons";

const CUSTOM_KEYS: IconName[] = ["gynecology", "fertility", "robot-surgery"];

const GROUPS: { title: string; keys: IconName[] }[] = [
  {
    title: "CMedical custom (forslag)",
    keys: CUSTOM_KEYS,
  },
  {
    title: "Helse / medisinsk",
    keys: ["heart-pulse", "stethoscope", "microscope", "pill", "syringe", "activity", "shield-check", "heart"],
  },
  {
    title: "Navigasjon / UI",
    keys: ["arrow-right", "arrow-left", "chevron-right", "chevron-down", "check", "x", "plus", "minus", "search", "help-circle"],
  },
  {
    title: "Kontakt / lokasjon",
    keys: ["phone", "mail", "map-pin", "clock", "calendar", "building"],
  },
  {
    title: "Mennesker / omsorg",
    keys: ["users", "user", "user-check", "baby"],
  },
  {
    title: "Info / tillit",
    keys: ["info", "star", "award", "file-text", "book-open", "sparkles"],
  },
  {
    title: "Økonomi",
    keys: ["coins", "credit-card", "tag"],
  },
  {
    title: "Diverse",
    keys: ["camera", "video", "play", "lock", "settings", "globe", "mic"],
  },
];

const SIZES = [16, 20, 24, 32];

const Swatch = ({
  name,
  isCustom,
}: {
  name: IconName;
  isCustom: boolean;
}) => {
  const Icon = getIcon(name);
  return (
    <div className="border border-foreground/10 rounded-md p-4 flex flex-col gap-3 bg-background">
      <div className="flex items-center justify-between">
        <code className="text-[11px] text-foreground/60">{name}</code>
        {isCustom && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ background: "#F4FF78", color: "#42332A" }}
          >
            CUSTOM
          </span>
        )}
      </div>

      {/* Sizes */}
      <div className="flex items-end gap-4 min-h-[44px]">
        {SIZES.map((sz) => (
          <div key={sz} className="flex flex-col items-center gap-1">
            <Icon size={sz} strokeWidth={1.5} />
            <span className="text-[10px] text-foreground/40">{sz}</span>
          </div>
        ))}
      </div>

      {/* Background tests */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-foreground/5">
        <span className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
          <Icon size={16} strokeWidth={1.5} /> tekst
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded"
          style={{ background: "#42332A", color: "#F2ECE6" }}
        >
          <Icon size={14} strokeWidth={1.5} />
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded"
          style={{ background: "#CCBAAD", color: "#42332A" }}
        >
          <Icon size={14} strokeWidth={1.5} />
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded"
          style={{ background: "#F4FF78", color: "#42332A" }}
        >
          <Icon size={14} strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
};

const IconPreview = () => {
  const allKeys = Object.keys(ICONS) as IconName[];
  const total = allKeys.length;

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12 font-light">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-2">
          <h1 className="text-2xl">Ikon-bibliotek — CMedical</h1>
          <p className="text-sm text-foreground/60 max-w-2xl">
            Alle ikoner som brukes på siden via <code>getIcon()</code>. {total} ikoner totalt:
            tre custom-tegnede CMedical-ikoner (gult merke) + Lucide-ikoner i samme stil
            (1.5px stroke, currentColor). Vist i 16/20/24/32 px og mot lys, mørk, mid skin-tone og gul accent.
          </p>
          <p className="text-xs text-foreground/50">
            Regel: ikoner brukes kun funksjonelt (16–24 px ved tekst). Aldri som store dekorative elementer.
          </p>
        </header>

        {GROUPS.map((group) => (
          <section key={group.title} className="space-y-4">
            <h2 className="text-base border-b border-foreground/10 pb-2">
              {group.title}{" "}
              <span className="text-xs text-foreground/40 ml-2">
                {group.keys.length} ikoner
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.keys.map((key) => (
                <Swatch
                  key={key}
                  name={key}
                  isCustom={CUSTOM_KEYS.includes(key)}
                />
              ))}
            </div>
          </section>
        ))}

        <footer className="pt-8 border-t border-foreground/10 text-xs text-foreground/50">
          Mangler du et ikon? Be meg lage flere custom-tegnede CMedical-ikoner
          (urologi, fastlege, ultralyd, graviditet, behandlingsplan, før/etter, m.fl.)
        </footer>
      </div>
    </main>
  );
};

export default IconPreview;
