import { Link } from "react-router-dom";
import { Pencil, PencilOff, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEditable } from "@/lib/editable/EditableContext";
import { cn } from "@/lib/utils";

/**
 * EditModeBar — discreet floating pill visible only to authenticated
 * editors/admins. Toggles inline edit mode on/off, links to /rediger,
 * and offers sign-out. Renders nothing for regular visitors.
 */
export const EditModeBar = () => {
  const { canEdit, editMode, setEditMode, user } = useEditable();

  if (!user || !canEdit) return null;

  return (
    <div
      className={cn(
        "fixed z-[60] bottom-4 right-4 flex items-center gap-2",
        "bg-brand-dark text-brand-light rounded-full pl-3 pr-1 py-1 shadow-lg",
        "text-xs font-light",
      )}
      role="toolbar"
      aria-label="Redigeringsverktøy"
    >
      <span className="hidden sm:inline opacity-70">
        {editMode ? "Rediger PÅ" : "Rediger AV"}
      </span>
      <button
        type="button"
        onClick={() => setEditMode(!editMode)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
          editMode
            ? "bg-[#F4FF78] text-brand-dark"
            : "bg-brand-light/10 hover:bg-brand-light/20",
        )}
        aria-pressed={editMode}
      >
        {editMode ? <PencilOff className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
        <span>{editMode ? "Skru av" : "Rediger side"}</span>
      </button>
      <Link
        to="/rediger"
        className="rounded-full px-2 py-1.5 hover:bg-brand-light/10"
        aria-label="Åpne redigeringspanelet"
      >
        Panel
      </Link>
      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="rounded-full p-1.5 hover:bg-brand-light/10"
        aria-label="Logg ut"
        title="Logg ut"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
