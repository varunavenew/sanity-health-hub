import { getIcon } from "@/lib/icons";

const samples = [
  { name: "gynecology", label: "Gynekologi" },
  { name: "fertility", label: "Fertilitet" },
  { name: "robot-surgery", label: "Robotkirurgi" },
];

const sizes = [16, 20, 24, 32, 48];

const IconPreview = () => {
  return (
    <main className="min-h-screen bg-background text-foreground p-8 md:p-16 font-light">
      <div className="max-w-3xl mx-auto space-y-12">
        <header>
          <h1 className="text-2xl mb-2">Custom CMedical-ikoner — prøvesett</h1>
          <p className="text-sm text-foreground/60">
            3 håndtegnede SVG-ikoner i Lucide-stil (1.5px stroke, currentColor).
            Godkjenn stilen før jeg lager resten.
          </p>
        </header>

        {samples.map((s) => {
          const Icon = getIcon(s.name);
          return (
            <section key={s.name} className="border-t border-foreground/10 pt-6">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg">{s.label}</h2>
                <code className="text-xs text-foreground/50">getIcon("{s.name}")</code>
              </div>

              <div className="flex items-end gap-8 mb-6">
                {sizes.map((sz) => (
                  <div key={sz} className="flex flex-col items-center gap-2">
                    <Icon size={sz} strokeWidth={1.5} />
                    <span className="text-xs text-foreground/50">{sz}px</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Icon size={18} strokeWidth={1.5} /> Standard tekstbruk
                </span>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: "#42332A", color: "#F2ECE6" }}
                >
                  <Icon size={16} strokeWidth={1.5} /> Mørk pille
                </span>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: "#F4FF78", color: "#42332A" }}
                >
                  <Icon size={16} strokeWidth={1.5} /> Gul accent
                </span>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
};

export default IconPreview;
