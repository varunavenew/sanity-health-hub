import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEditable } from "@/lib/editable/EditableContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LogOut, ChevronDown, CheckCircle2 } from "lucide-react";

/**
 * /lansering — intern lanserings-sjekkliste.
 * Bak samme innlogging som /rediger. Status deles i sanntid via databasen.
 */

type Row = {
  id: string;
  seksjon: string;
  oppgave: string;
  ansvarlig: string;
  status: string;
  ferdig: boolean;
  kommentar: string;
  sort_order: number;
  updated_at: string;
  updated_by: string;
};

const STATUSES = ["Ikke startet", "Pågår", "Ferdig", "Venter på andre", "Blokkert"] as const;

const statusRowClass: Record<string, string> = {
  "Ikke startet": "bg-white",
  "Pågår": "bg-amber-50",
  "Ferdig": "bg-emerald-50",
  "Venter på andre": "bg-sky-50",
  "Blokkert": "bg-rose-50",
};

const Lansering = () => {
  const { user, loading } = useEditable();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [fetching, setFetching] = useState(true);
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.title = "Lansering — intern sjekkliste | CMedical";
  }, []);

  useEffect(() => {
    if (!user) return;
    let active = true;

    const load = async () => {
      const { data, error } = await supabase
        .from("launch_checklist")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!active) return;
      if (error) toast.error(error.message);
      setRows((data as Row[]) ?? []);
      setFetching(false);
    };
    load();

    const channel = supabase
      .channel("launch_checklist_rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "launch_checklist" },
        (payload) => {
          const next = payload.new as Row;
          if (payload.eventType === "DELETE") {
            setRows((prev) => prev.filter((r) => r.id !== (payload.old as Row).id));
          } else {
            setRows((prev) => {
              const exists = prev.some((r) => r.id === next.id);
              const merged = exists
                ? prev.map((r) => (r.id === next.id ? next : r))
                : [...prev, next];
              return merged.sort((a, b) => a.sort_order - b.sort_order);
            });
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sections = useMemo(() => {
    const map = new Map<string, Row[]>();
    rows.forEach((r) => {
      const arr = map.get(r.seksjon) ?? [];
      arr.push(r);
      map.set(r.seksjon, arr);
    });
    return Array.from(map.entries());
  }, [rows]);

  const doneCount = rows.filter((r) => r.ferdig || r.status === "Ferdig").length;
  const total = rows.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  const patch = async (row: Row, changes: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...changes } : r)));
    const { error } = await supabase
      .from("launch_checklist")
      .update({ ...changes, updated_by: user?.email ?? "" })
      .eq("id", row.id);
    if (error) toast.error(error.message);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Innlogget");
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-light px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-light text-brand-dark mb-2">Lansering</h1>
            <p className="text-sm text-brand-dark/70 font-light">
              Intern innlogging for CMedical-teamet.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-brand-dark/70">E-post</Label>
              <Input id="email" type="email" autoComplete="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} className="bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-brand-dark/70">Passord</Label>
              <Input id="password" type="password" autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white" />
            </div>
            <Button type="submit" variant="cta" className="w-full" disabled={busy}>
              {busy ? "Logger inn…" : "Logg inn"}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-light px-6 py-14">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-light text-brand-dark mb-2">Lanserings-sjekkliste</h1>
            <p className="text-sm text-brand-dark/70 font-light">
              Innlogget som <span className="text-brand-dark">{user.email}</span>
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
            <LogOut className="w-4 h-4 mr-2" /> Logg ut
          </Button>
        </div>

        <div className="flex items-start gap-3 bg-white rounded-lg p-4 mb-6">
          <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
          <p className="text-sm text-brand-dark font-light">
            Grunnmur ferdig: design ferdigstilt og innhold kodet inn i Sanity.
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 mb-8">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-sm text-brand-dark">
              {doneCount} av {total} ferdig
            </p>
            <p className="text-sm text-brand-dark/70 font-light">{pct}%</p>
          </div>
          <div
            className="h-2 w-full rounded-full bg-brand-dark/10 overflow-hidden"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Fremdrift"
          >
            <div
              className="h-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {fetching && (
          <p className="text-sm text-brand-dark/60 font-light">Laster sjekkliste…</p>
        )}

        <div className="space-y-5">
          {sections.map(([seksjon, items]) => {
            const isClosed = !!closed[seksjon];
            const sDone = items.filter((r) => r.ferdig || r.status === "Ferdig").length;
            return (
              <section key={seksjon} className="bg-white rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setClosed((p) => ({ ...p, [seksjon]: !p[seksjon] }))}
                  aria-expanded={!isClosed}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-brand-light/50"
                >
                  <span className="text-base text-brand-dark">{seksjon}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-brand-dark/60">{sDone}/{items.length}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-brand-dark/60 transition-transform ${isClosed ? "" : "rotate-180"}`}
                    />
                  </span>
                </button>

                {!isClosed && (
                  <ul className="divide-y divide-brand-dark/10 border-t border-brand-dark/10">
                    {items.map((row) => (
                      <li
                        key={row.id}
                        className={`px-5 py-4 ${statusRowClass[row.status] ?? "bg-white"}`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`chk-${row.id}`}
                            checked={row.ferdig}
                            onCheckedChange={(v) =>
                              patch(row, {
                                ferdig: !!v,
                                status: v ? "Ferdig" : row.status === "Ferdig" ? "Pågår" : row.status,
                              })
                            }
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={`chk-${row.id}`}
                              className={`block text-sm font-light text-brand-dark ${row.ferdig ? "line-through opacity-60" : ""}`}
                            >
                              {row.oppgave}
                            </label>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              {row.ansvarlig && (
                                <span className="text-xs px-2 py-1 rounded-full bg-brand-dark/5 text-brand-dark">
                                  {row.ansvarlig}
                                </span>
                              )}
                              <select
                                value={row.status}
                                onChange={(e) => {
                                  const s = e.target.value;
                                  patch(row, { status: s, ferdig: s === "Ferdig" ? true : row.ferdig });
                                }}
                                aria-label={`Status for ${row.oppgave}`}
                                className="text-xs bg-white border border-brand-dark/15 rounded-md px-2 py-1 text-brand-dark"
                              >
                                {STATUSES.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>

                            <textarea
                              defaultValue={row.kommentar}
                              onBlur={(e) => {
                                if (e.target.value !== row.kommentar) {
                                  patch(row, { kommentar: e.target.value });
                                }
                              }}
                              rows={1}
                              placeholder="Kommentar…"
                              aria-label={`Kommentar for ${row.oppgave}`}
                              className="mt-2 w-full text-xs font-light bg-white border border-brand-dark/15 rounded-md px-2 py-1.5 text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:ring-1 focus:ring-brand-dark/30"
                            />

                            {row.updated_by && (
                              <p className="mt-1 text-xs text-brand-dark/45 font-light">
                                Sist endret av {row.updated_by}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Lansering;
