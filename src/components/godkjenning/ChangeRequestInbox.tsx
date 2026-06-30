import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Paperclip, Check, Clock, Loader2, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type ChangeStatus = "apen" | "under_arbeid" | "ferdig";

export interface ChangeRequest {
  id: string;
  page_path: string;
  page_name: string;
  message: string;
  status: ChangeStatus;
  attachments: { name: string; url: string; type: string }[];
  created_by: string;
  resolved_by: string;
  created_at: string;
  updated_at: string;
}

const STATUS_META: Record<ChangeStatus, { label: string; bg: string; dot: string }> = {
  apen: { label: "Åpen", bg: "bg-rose-50 text-rose-900 border-rose-200", dot: "bg-rose-500" },
  under_arbeid: { label: "Under arbeid", bg: "bg-amber-50 text-amber-900 border-amber-200", dot: "bg-amber-500" },
  ferdig: { label: "Ferdig", bg: "bg-emerald-50 text-emerald-900 border-emerald-200", dot: "bg-emerald-500" },
};

interface Props {
  requests: ChangeRequest[];
  reviewer: string;
}

export const ChangeRequestInbox = ({ requests, reviewer }: Props) => {
  const [filter, setFilter] = useState<"alle" | ChangeStatus>("apen");
  const [busy, setBusy] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { total: requests.length, apen: 0, under_arbeid: 0, ferdig: 0 };
    requests.forEach((r) => { c[r.status]++; });
    return c;
  }, [requests]);

  const filtered = useMemo(() => {
    const list = filter === "alle" ? requests : requests.filter((r) => r.status === filter);
    return [...list].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [requests, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, ChangeRequest[]>();
    filtered.forEach((r) => {
      const key = `${r.page_name}__${r.page_path}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const setStatus = async (req: ChangeRequest, status: ChangeStatus) => {
    setBusy(req.id);
    const patch: any = { status };
    if (status === "ferdig") patch.resolved_by = reviewer || req.resolved_by || "";
    const { error } = await supabase.from("change_requests").update(patch).eq("id", req.id);
    setBusy(null);
    if (error) toast({ title: "Klarte ikke oppdatere", description: error.message, variant: "destructive" });
  };

  const remove = async (req: ChangeRequest) => {
    if (!confirm("Slett denne forespørselen?")) return;
    setBusy(req.id);
    const { error } = await supabase.from("change_requests").delete().eq("id", req.id);
    setBusy(null);
    if (error) toast({ title: "Klarte ikke slette", description: error.message, variant: "destructive" });
  };

  if (requests.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-sm text-muted-foreground">Ingen endringsforespørsler ennå. Klikk "Endringer ønskes" på en side for å sende første tilbakemelding.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex gap-1 text-xs">
          {([
            ["apen", `Åpne (${counts.apen})`],
            ["under_arbeid", `Under arbeid (${counts.under_arbeid})`],
            ["ferdig", `Ferdig (${counts.ferdig})`],
            ["alle", `Alle (${counts.total})`],
          ] as const).map(([f, label]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-md border transition-colors ${
                filter === f ? "bg-foreground text-background border-foreground" : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ingen forespørsler matcher filteret.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map(([key, items]) => {
            const [name, path] = key.split("__");
            return (
              <section key={key} className="border border-border rounded-lg overflow-hidden">
                <header className="px-4 py-3 bg-muted/40 flex items-center justify-between gap-3 border-b border-border">
                  <div className="min-w-0">
                    <p className="text-sm font-light text-foreground truncate">{name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">{path}</p>
                  </div>
                  <Link
                    to={path}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Åpne side <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </header>
                <ul className="divide-y divide-border">
                  {items.map((req) => (
                    <li key={req.id} className="p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-2xl md:rounded-full border ${STATUS_META[req.status].bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-2xl ${STATUS_META[req.status].dot}`} />
                          {STATUS_META[req.status].label}
                        </span>
                        <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(req.created_at).toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" })}
                          {req.created_by ? ` · ${req.created_by}` : ""}
                        </p>
                      </div>

                      {req.message && (
                        <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{req.message}</p>
                      )}

                      {req.attachments?.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {req.attachments.map((a, i) => (
                            <a
                              key={i}
                              href={a.url}
                              target="_blank"
                              rel="noreferrer"
                              className="group border border-border rounded-md overflow-hidden bg-background hover:border-foreground transition-colors"
                            >
                              {a.type?.startsWith("image/") ? (
                                <img src={a.url} alt={a.name} className="w-full h-24 object-cover" loading="lazy" />
                              ) : (
                                <div className="w-full h-24 flex items-center justify-center bg-muted/40">
                                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="px-2 py-1.5 text-[11px] text-muted-foreground group-hover:text-foreground truncate flex items-center gap-1">
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{a.name}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex gap-1.5 flex-wrap">
                          {(["apen", "under_arbeid", "ferdig"] as ChangeStatus[]).map((s) => (
                            <button
                              key={s}
                              disabled={busy === req.id}
                              onClick={() => setStatus(req, s)}
                              className={`text-xs px-3 py-1.5 rounded-md border transition-colors disabled:opacity-50 ${
                                req.status === s
                                  ? `${STATUS_META[s].bg} border-transparent`
                                  : "border-border text-muted-foreground hover:text-foreground bg-background"
                              }`}
                            >
                              {s === "ferdig" && <Check className="inline w-3 h-3 mr-1" />}
                              {STATUS_META[s].label}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => remove(req)}
                          disabled={busy === req.id}
                          className="text-[11px] text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
                        >
                          {busy === req.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          Slett
                        </button>
                      </div>

                      {req.status === "ferdig" && req.resolved_by && (
                        <p className="mt-2 text-[11px] text-emerald-700">Ferdigstilt av {req.resolved_by}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
