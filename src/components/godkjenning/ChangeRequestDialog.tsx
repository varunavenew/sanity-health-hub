import { useEffect, useState } from "react";
import { Paperclip, X, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ChangeRequestDialogProps {
  open: boolean;
  onClose: () => void;
  pagePath: string;
  pageName: string;
  reviewer: string;
  onCreated?: () => void;
}

interface PendingFile {
  file: File;
  preview?: string;
}

export const ChangeRequestDialog = ({
  open,
  onClose,
  pagePath,
  pageName,
  reviewer,
  onCreated,
}: ChangeRequestDialogProps) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setMessage("");
      setFiles([]);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next: PendingFile[] = [];
    Array.from(list).forEach((f) => {
      if (f.size > 10 * 1024 * 1024) {
        toast({ title: `${f.name} er for stor`, description: "Maks 10 MB per fil.", variant: "destructive" });
        return;
      }
      next.push({ file: f, preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined });
    });
    setFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    if (!message.trim() && files.length === 0) {
      toast({ title: "Tom forespørsel", description: "Skriv en melding eller legg ved en fil." });
      return;
    }
    setSubmitting(true);
    try {
      const uploaded: { name: string; url: string; type: string }[] = [];
      for (const pf of files) {
        const safe = pf.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${pagePath.replace(/^\//, "").replace(/\//g, "_") || "root"}/${Date.now()}-${safe}`;
        const { error: upErr } = await supabase.storage
          .from("approval-attachments")
          .upload(path, pf.file, { contentType: pf.file.type, upsert: false });
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("approval-attachments").getPublicUrl(path);
        uploaded.push({ name: pf.file.name, url: urlData.publicUrl, type: pf.file.type });
      }

      const { error } = await supabase.from("change_requests").insert({
        page_path: pagePath,
        page_name: pageName,
        message: message.trim(),
        status: "apen",
        attachments: uploaded,
        created_by: reviewer || "Anonym",
      });
      if (error) throw error;

      toast({ title: "Endring registrert", description: "Forespørselen er lagt til i innboksen." });
      onCreated?.();
      onClose();
    } catch (e: any) {
      toast({ title: "Klarte ikke sende", description: e.message ?? String(e), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-background w-full md:max-w-xl rounded-t-2xl md:rounded-xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-border flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Endringer ønskes</p>
            <h3 className="text-xl font-light text-foreground mt-1 truncate">{pageName}</h3>
            <p className="text-xs text-muted-foreground font-mono truncate">{pagePath}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Beskriv hva som må endres</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              autoFocus
              placeholder="F.eks. 'Headeren er for stor på mobil', 'Erstatt bildet i hero med vedlagte fil', 'Teksten under prisene er feil'…"
              className="w-full border border-border bg-background px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Vedlegg (valgfritt)</label>
            <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-md px-4 py-6 text-sm text-muted-foreground hover:bg-muted/40 cursor-pointer transition-colors">
              <Paperclip className="w-4 h-4" />
              <span>Velg filer (skjermbilder, PDF, bilder…) eller dra hit</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
                accept="image/*,application/pdf,.doc,.docx,.txt"
              />
            </label>
            {files.length > 0 && (
              <ul className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 border border-border rounded-md px-3 py-2">
                    {f.preview ? (
                      <img src={f.preview} alt="" className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-muted flex items-center justify-center rounded">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate">{f.file.name}</p>
                      <p className="text-[11px] text-muted-foreground">{(f.file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-2 border-t border-border bg-muted/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md"
            disabled={submitting}
          >
            Avbryt
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-sm rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send forespørsel
          </button>
        </div>
      </div>
    </div>
  );
};
