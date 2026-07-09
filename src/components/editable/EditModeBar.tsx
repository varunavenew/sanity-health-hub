import { Link } from "react-router-dom";
import { Pencil, PencilOff, LogOut, Loader2, Check, AlertCircle, Save, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEditable } from "@/lib/editable/EditableContext";
import { cn } from "@/lib/utils";

/**
 * EditModeBar — floating control shown only to authenticated editors/admins.
 */
export const EditModeBar = () => {
  const {
    canEdit,
    editMode,
    setEditMode,
    user,
    saveStatus,
    pendingCount,
    saveAllPending,
    discardAllPending,
  } = useEditable();

  if (!user || !canEdit) return null;

  const statusPill = (() => {
    if (saveStatus === "saving") {
      return (
        <span className="inline-flex items-center gap-1.5 text-brand-dark bg-white/95 rounded-full px-3 py-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          Lagrer…
        </span>
      );
    }
    if (saveStatus === "saved") {
      return (
        <span className="inline-flex items-center gap-1.5 text-[#0b3a1f] bg-[#B9F5C9] rounded-full px-3 py-1.5">
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          Lagret
        </span>
      );
    }
    if (saveStatus === "error") {
      return (
        <span className="inline-flex items-center gap-1.5 text-white bg-red-600 rounded-full px-3 py-1.5">
          <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
          Feil ved lagring
        </span>
      );
    }
    return null;
  })();

  return (
    <div
      className={cn(
        "fixed z-[60] bottom-5 right-5 flex items-center gap-2",
        "bg-brand-dark text-brand-light rounded-full pl-2 pr-2 py-2 shadow-2xl",
        "ring-1 ring-black/20",
        "text-sm font-normal",
      )}
      role="toolbar"
      aria-label="Redigeringsverktøy"
    >
      {/* Prominent status + toggle */}
      <button
        type="button"
        onClick={() => setEditMode(!editMode)}
        aria-pressed={editMode}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors font-medium",
          editMode
            ? "bg-[#F4FF78] text-brand-dark hover:brightness-95"
            : "bg-white text-brand-dark hover:bg-white/90",
        )}
      >
        {editMode ? (
          <Pencil className="w-4 h-4" aria-hidden="true" />
        ) : (
          <PencilOff className="w-4 h-4" aria-hidden="true" />
        )}
        <span>{editMode ? "Redigering PÅ" : "Redigering AV"}</span>
      </button>

      {statusPill}

      <Link
        to="/rediger"
        className="rounded-full px-3 py-2 text-brand-light hover:bg-white/10"
        aria-label="Åpne redigeringspanelet"
      >
        Panel
      </Link>
      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="rounded-full p-2 text-brand-light hover:bg-white/10"
        aria-label="Logg ut"
        title="Logg ut"
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};
