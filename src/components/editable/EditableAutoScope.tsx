import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEditable } from "@/lib/editable/EditableContext";

/**
 * EditableAutoScope — makes ALL visible text in its subtree inline-editable
 * for signed-in editors when Rediger PÅ is active.
 *
 * It works by walking DOM text nodes on every render/overrides update:
 *   - each text node gets a stable auto-key derived from its DOM path
 *   - if an override exists in content_overrides for {path, key}, it is
 *     applied to the DOM immediately
 *   - when editMode is on, the scope container becomes contentEditable and
 *     changes are persisted on focusout (blur)
 *
 * Explicit <Editable> instances and elements tagged with data-no-autoedit
 * are skipped. Form controls, scripts, and hidden nodes are also skipped.
 *
 * Layout is preserved via `display: contents` on the wrapper.
 */

const FIELD_ATTR = "data-auto-field";

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

const isSkipped = (el: Element | null): boolean => {
  if (!el) return true;
  if (el.closest("script,style,noscript,textarea,input,select,option,svg")) return true;
  if (el.closest("[data-editable-field]")) return true; // explicit <Editable>
  if (el.closest("[data-no-autoedit]")) return true;
  return false;
};

export const EditableAutoScope = ({ path, children }: Props) => {
  const { editMode, overrides, canEdit, saveOverride } = useEditable();
  const location = useLocation();
  const pagePath = path ?? location.pathname;
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Track current DOM text per field key so we can detect changes on blur.
  const currentValues = useRef<Map<string, string>>(new Map());
  // Track parent element per key so we can locate the text node on blur.
  const parentByKey = useRef<Map<string, Element>>(new Map());

  // Walk text nodes, tag them, apply overrides. Runs synchronously with layout
  // so overrides are visible from first paint.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

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
      const key = computePath(textNode, root);
      const parent = textNode.parentElement;
      if (!parent) continue;
      const overrideKey = `${pagePath}::${key}`;
      const override = overrides[overrideKey];
      if (override !== undefined && textNode.nodeValue !== override) {
        textNode.nodeValue = override;
      }
      parent.setAttribute(FIELD_ATTR, key);
      currentValues.current.set(key, textNode.nodeValue ?? "");
      parentByKey.current.set(key, parent);
    }
  });

  // Toggle contentEditable on the root when edit mode is active.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (editMode && canEdit) {
      root.setAttribute("contenteditable", "true");
      root.setAttribute("spellcheck", "true");
    } else {
      root.removeAttribute("contenteditable");
    }
  }, [editMode, canEdit]);

  // On blur inside the scope, check keyed nodes for changes and save.
  useEffect(() => {
    if (!editMode || !canEdit) return;
    const root = rootRef.current;
    if (!root) return;

    const onFocusOut = async () => {
      // Give the browser a tick to commit the caret / DOM changes.
      await Promise.resolve();
      for (const [key, parent] of parentByKey.current.entries()) {
        if (!root.contains(parent)) continue;
        // Find the first meaningful text child of parent.
        let text: Text | null = null;
        for (const child of Array.from(parent.childNodes)) {
          if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) {
            text = child as Text;
            break;
          }
        }
        if (!text) continue;
        const next = (text.nodeValue ?? "").replace(/\u00A0/g, " ");
        const prev = currentValues.current.get(key) ?? "";
        if (next.trim() === prev.trim()) continue;
        currentValues.current.set(key, next);
        try {
          await saveOverride(pagePath, key, next.trim());
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Kunne ikke lagre";
          toast.error(msg);
        }
      }
    };

    root.addEventListener("focusout", onFocusOut);
    return () => root.removeEventListener("focusout", onFocusOut);
  }, [editMode, canEdit, pagePath, saveOverride]);

  return (
    <div
      ref={rootRef}
      data-editable-scope={pagePath}
      suppressContentEditableWarning
      style={{ display: "contents" }}
    >
      {children}
    </div>
  );
};
