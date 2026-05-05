import { useEffect, useState, type ReactNode } from "react";

const ACCESS_CODE = "cmedical2026";
const STORAGE_KEY = "cm_demo_access";

interface AccessGateProps {
  children: ReactNode;
}

export const AccessGate = ({ children }: AccessGateProps) => {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1" || localStorage.getItem(STORAGE_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {}
    setChecked(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() === ACCESS_CODE) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  if (!checked) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 text-left"
      >
        <div>
          <h1 className="text-2xl font-light text-foreground mb-2">Tilgang kreves</h1>
          <p className="text-sm text-muted-foreground">
            Dette er en privat demo. Vennligst skriv inn tilgangskoden for å fortsette.
          </p>
        </div>
        <div className="space-y-2">
          <input
            type="password"
            autoFocus
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Tilgangskode"
            className="w-full border border-border bg-background px-4 py-3 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <p className="text-sm text-destructive">Feil kode. Prøv igjen.</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-foreground text-background py-3 rounded-md hover:opacity-90 transition"
        >
          Logg inn
        </button>
      </form>
    </div>
  );
};
