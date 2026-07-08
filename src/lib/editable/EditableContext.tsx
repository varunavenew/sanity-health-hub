import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Editable content system
 * ------------------------
 * Provides three things globally:
 *   1. Auth session (Supabase) — who is logged in.
 *   2. Editor role (has_role admin|editor) — who is allowed to edit.
 *   3. Overrides map — { "<page_path>::<field_id>": value }
 *      Loaded once on mount and kept in sync via Realtime, so any
 *      <Editable> component instantly reflects saved changes.
 *
 * Editing UI (thin outline / inline contentEditable) only turns on when
 * `editMode === true` AND the current user has the editor/admin role.
 */

type OverridesMap = Record<string, string>;

interface EditableContextValue {
  session: Session | null;
  user: User | null;
  canEdit: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  overrides: OverridesMap;
  getOverride: (pagePath: string, fieldId: string) => string | undefined;
  saveOverride: (pagePath: string, fieldId: string, value: string) => Promise<void>;
  resetOverride: (pagePath: string, fieldId: string) => Promise<void>;
  loading: boolean;
}

const EditableContext = createContext<EditableContextValue | null>(null);

const EDIT_MODE_STORAGE_KEY = "cmedical.editMode";
const keyOf = (path: string, field: string) => `${path}::${field}`;

export const EditableProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [editMode, setEditModeState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(EDIT_MODE_STORAGE_KEY) === "1";
  });
  const [overrides, setOverrides] = useState<OverridesMap>({});
  const [loading, setLoading] = useState(true);

  const setEditMode = useCallback((v: boolean) => {
    setEditModeState(v);
    try {
      window.localStorage.setItem(EDIT_MODE_STORAGE_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  // Auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Role check
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session?.user) {
        setCanEdit(false);
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      if (cancelled) return;
      if (error) {
        setCanEdit(false);
        return;
      }
      const roles = new Set((data ?? []).map((r) => r.role));
      setCanEdit(roles.has("admin") || roles.has("editor"));
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  // Initial fetch + realtime subscription for overrides
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("content_overrides")
        .select("page_path, field_id, value");
      if (!mounted) return;
      if (!error && data) {
        const next: OverridesMap = {};
        for (const row of data) {
          next[keyOf(row.page_path, row.field_id)] = row.value ?? "";
        }
        setOverrides(next);
      }
      setLoading(false);
    })();

    const channel = supabase
      .channel("content_overrides_stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "content_overrides" },
        (payload) => {
          setOverrides((prev) => {
            const next = { ...prev };
            if (payload.eventType === "DELETE") {
              const oldRow = payload.old as { page_path?: string; field_id?: string };
              if (oldRow?.page_path && oldRow?.field_id) {
                delete next[keyOf(oldRow.page_path, oldRow.field_id)];
              }
            } else {
              const row = payload.new as {
                page_path: string;
                field_id: string;
                value: string;
              };
              next[keyOf(row.page_path, row.field_id)] = row.value ?? "";
            }
            return next;
          });
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const getOverride = useCallback(
    (pagePath: string, fieldId: string) => overrides[keyOf(pagePath, fieldId)],
    [overrides],
  );

  const saveOverride = useCallback(
    async (pagePath: string, fieldId: string, value: string) => {
      // Optimistic
      setOverrides((prev) => ({ ...prev, [keyOf(pagePath, fieldId)]: value }));
      const { error } = await supabase.from("content_overrides").upsert(
        {
          page_path: pagePath,
          field_id: fieldId,
          value,
          updated_by: session?.user?.id ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_path,field_id" },
      );
      if (error) throw error;
    },
    [session],
  );

  const resetOverride = useCallback(async (pagePath: string, fieldId: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[keyOf(pagePath, fieldId)];
      return next;
    });
    const { error } = await supabase
      .from("content_overrides")
      .delete()
      .eq("page_path", pagePath)
      .eq("field_id", fieldId);
    if (error) throw error;
  }, []);

  const value = useMemo<EditableContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      canEdit,
      editMode: editMode && canEdit,
      setEditMode,
      overrides,
      getOverride,
      saveOverride,
      resetOverride,
      loading,
    }),
    [session, canEdit, editMode, setEditMode, overrides, getOverride, saveOverride, resetOverride, loading],
  );

  return <EditableContext.Provider value={value}>{children}</EditableContext.Provider>;
};

export const useEditable = () => {
  const ctx = useContext(EditableContext);
  if (!ctx) throw new Error("useEditable must be used inside <EditableProvider>");
  return ctx;
};
