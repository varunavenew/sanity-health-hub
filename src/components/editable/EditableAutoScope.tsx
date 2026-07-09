import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEditable } from "@/lib/editable/EditableContext";

/**
 * EditableAutoScope — makes visible text in its subtree inline-editable
 * for signed-in editors when Rediger PÅ is active.
 *
 * Implementation notes (safety-first):
 *   - The wrapper uses display:contents and NEVER becomes contentEditable
 *     itself. Only individual parent elements of safe text nodes are toggled
 *     to contentEditable when edit mode is on. This prevents contentEditable
 *     from clobbering interactive widgets (radio groups, popovers, SVGs,
 *     Radix Slots) that don't tolerate being nested inside an editable root.
 *   - All DOM mutations happen inside try/catch so a broken text node never
 *     crashes the surrounding React tree.
 *   - Explicit <Editable> instances and elements tagged with data-no-autoedit
 *     are skipped. Form controls, scripts, and hidden nodes are also skipped.
 */

const FIELD_ATTR = "data-auto-field";
const EDIT_MARK_ATTR = "data-auto-editing";

interface Props {
  path?: string; // page path override; defaults to current pathname
  children: ReactNode;
}

const computePath = (node: Node, root: Element): string => {
  const parts: string[] = [];
  let cur: Node | null = node;
  while (cur && cur !== root && cur.parentNode) {
    const parent = cur.parentNode;
    const idx = Array.prototype.indexOf.call(parent.childNodes, cur);
    const tag =
      cur.nodeType === Node.ELEMENT_NODE
        ? (cur as Element).tagName.toLowerCase()
        : "t";
    parts.push(`${tag}${idx}`);
    cur = parent;
  }
  return parts.reverse().join("/");
};

// Elements whose children we should never touch or auto-edit.
const HARD_SKIP_SELECTOR =
  "script,style,noscript,textarea,input,select,option,svg,picture,video,audio,iframe,canvas";

const isSkipped = (el: Element | null): boolean => {
  if (!el) return true;
  try {
    if (el.closest(HARD_SKIP_SELECTOR)) return true;
    if (el.closest("[data-editable-field]")) return true; // explicit <Editable>
    if (el.closest("[data-no-autoedit]")) return true;
    if (el.closest("[aria-hidden='true']")) return true;
    // Skip radio/checkbox/menu items — contentEditable breaks their a11y focus.
    if (el.closest("[role='radio'],[role='checkbox'],[role='menuitemcheckbox'],[role='menuitemradio']")) return true;
  } catch {
    return true;
  }
  return false;
};

// A text node is "safely editable" only when its parent contains a single
// text node (no mixed markup around it). Editing mixed content risks
// destroying nested elements.
const isSafeSoloText = (text: Text, parent: Element): boolean => {
  let textCount = 0;
  let elementCount = 0;
  for (const child of Array.from(parent.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      if ((child.nodeValue ?? "").trim()) textCount++;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      elementCount++;
    }
  }
  // Allow: exactly one text node OR one text node next to purely decorative
  // inline children (br). If there are other elements, skip.
  if (textCount !== 1) return false;
  if (elementCount === 0) return true;
  return Array.from(parent.children).every((c) => c.tagName === "BR");
};

export const EditableAutoScope = ({ path, children }: Props) => {
  const { editMode, overrides, canEdit, saveOverride, setPending, clearPending, discardNonce } = useEditable();
  const location = useLocation();
  const pagePath = path ?? location.pathname;
  const rootRef = useRef<HTMLDivElement | null>(null);

  const currentValues = useRef<Map<string, string>>(new Map());
  const parentByKey = useRef<Map<string, Element>>(new Map());

  // Walk text nodes, tag safe ones, apply overrides.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    try {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (isSkipped(node.parentElement)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      currentValues.current.clear();
      parentByKey.current.clear();

      const nodes: Text[] = [];
      let n = walker.nextNode();
      while (n) {
        nodes.push(n as Text);
        n = walker.nextNode();
      }

      for (const textNode of nodes) {
        const parent = textNode.parentElement;
        if (!parent) continue;
        if (!isSafeSoloText(textNode, parent)) continue;
        const key = computePath(textNode, root);
        const overrideKey = `${pagePath}::${key}`;
        const override = overrides[overrideKey];
        if (override !== undefined && textNode.nodeValue !== override) {
          textNode.nodeValue = override;
        }
        parent.setAttribute(FIELD_ATTR, key);
        currentValues.current.set(key, textNode.nodeValue ?? "");
        parentByKey.current.set(key, parent);
      }
    } catch (err) {
      if (typeof console !== "undefined") console.warn("EditableAutoScope walk failed", err);
    }
  });

  // Toggle contentEditable on tagged parents.
  useEffect(() => {
    const active = editMode && canEdit;
    const parents = Array.from(parentByKey.current.values());
    for (const p of parents) {
      try {
        if (active) {
          p.setAttribute("contenteditable", "plaintext-only");
          p.setAttribute("spellcheck", "true");
          p.setAttribute(EDIT_MARK_ATTR, "1");
        } else if (p.getAttribute(EDIT_MARK_ATTR) === "1") {
          p.removeAttribute("contenteditable");
          p.removeAttribute("spellcheck");
          p.removeAttribute(EDIT_MARK_ATTR);
        }
      } catch {
        /* ignore */
      }
    }
    return () => {
      for (const p of parents) {
        try {
          if (p.getAttribute(EDIT_MARK_ATTR) === "1") {
            p.removeAttribute("contenteditable");
            p.removeAttribute("spellcheck");
            p.removeAttribute(EDIT_MARK_ATTR);
          }
        } catch {
          /* ignore */
        }
      }
    };
  }, [editMode, canEdit, overrides]);

  // Discard: restore all tagged nodes to their last saved value.
  useEffect(() => {
    if (discardNonce === 0) return;
    for (const [key, parent] of parentByKey.current.entries()) {
      const saved = currentValues.current.get(key);
      if (saved === undefined) continue;
      for (const child of Array.from(parent.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE && (child.nodeValue ?? "").trim()) {
          if (child.nodeValue !== saved) child.nodeValue = saved;
          break;
        }
      }
    }
  }, [discardNonce]);

  // Track pending edits on input; save on blur.
  useEffect(() => {
    if (!editMode || !canEdit) return;
    const root = rootRef.current;
    if (!root) return;

    const readValue = (parent: Element): string | null => {
      for (const child of Array.from(parent.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) {
          return (child.nodeValue ?? "").replace(/\u00A0/g, " ");
        }
      }
      return null;
    };

    const findKeyFor = (target: EventTarget | null): { key: string; parent: Element } | null => {
      if (!(target instanceof Element)) return null;
      const parent = target.closest(`[${FIELD_ATTR}]`);
      if (!parent) return null;
      const key = parent.getAttribute(FIELD_ATTR);
      if (!key) return null;
      return { key, parent };
    };

    const onInput = (e: Event) => {
      const found = findKeyFor(e.target);
      if (!found) return;
      const next = readValue(found.parent);
      if (next === null) return;
      const saved = currentValues.current.get(found.key) ?? "";
      if (next.trim() === saved.trim()) {
        clearPending(pagePath, found.key);
      } else {
        setPending(pagePath, found.key, next.trim());
      }
    };

    const onFocusOut = async () => {
      await Promise.resolve();
      for (const [key, parent] of parentByKey.current.entries()) {
        if (!root.contains(parent)) continue;
        const next = readValue(parent);
        if (next === null) continue;
        const prev = currentValues.current.get(key) ?? "";
        if (next.trim() === prev.trim()) continue;
        currentValues.current.set(key, next);
        try {
          await saveOverride(pagePath, key, next.trim());
          clearPending(pagePath, key);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Kunne ikke lagre";
          toast.error(msg);
        }
      }
    };

    root.addEventListener("input", onInput);
    root.addEventListener("focusout", onFocusOut);
    return () => {
      root.removeEventListener("input", onInput);
      root.removeEventListener("focusout", onFocusOut);
    };
  }, [editMode, canEdit, pagePath, saveOverride, setPending, clearPending]);

  return (
    <div
      ref={rootRef}
      data-editable-scope={pagePath}
      style={{ display: "contents" }}
    >
      {children}
    </div>
  );
};
