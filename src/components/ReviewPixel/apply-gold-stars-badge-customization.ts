const CSS = [
  ".badge-inline { background: transparent !important; padding: 0 !important; }",
  ".badge-box { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; border-radius: 0 !important; width: auto !important; display: flex !important; flex-direction: column !important; align-items: center !important; row-gap: 0.375rem; }",
  ".badge-sources { display: flex; align-items: center; gap: 0.25rem; }",
  ".badge-source-logo { width: 1.25rem !important; height: 1.25rem !important; }",
  ".badge-stars { display: flex; align-items: center; gap: 0.125rem; }",
  ".badge-stars svg { width: 1.05rem !important; height: 1.05rem !important; }",
  '.badge-rating-text { color: var(--cmgs-badge-text, #fff) !important; font-family: "ABC Ginto Normal", -apple-system, system-ui, "Segoe UI", sans-serif !important; font-size: 0.9375rem !important; font-weight: 300 !important; text-shadow: var(--cmgs-badge-shadow, 0 1px 3px rgba(0,0,0,.35)); white-space: nowrap; }',
  ".badge-rating-text b { font-weight: 500 !important; }",
].join("\n");

function translate(root: ShadowRoot): void {
  const ratingText = root.querySelector(".badge-rating-text");
  if (!ratingText) return;

  Array.from(ratingText.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = (node.textContent || "")
        .replace(/\s*rating from\s*/i, " i snitt fra ")
        .replace(/\s*reviews\s*/i, " omtaler");
    } else if (node instanceof HTMLElement && node.tagName === "B") {
      node.textContent = (node.textContent || "").replace(".", ",");
    }
  });
}

function apply(root: ShadowRoot): boolean {
  const box = root.querySelector(".badge-box");
  if (!box) return false;

  if (!root.querySelector("#cmgs-badge-style")) {
    const style = document.createElement("style");
    style.id = "cmgs-badge-style";
    style.textContent = CSS;
    root.appendChild(style);
  }

  translate(root);
  return true;
}

export function setupGoldStarsBadgeCustomization(el: HTMLElement): () => void {
  let tries = 0;
  let observer: MutationObserver | null = null;
  let pendingTimeout: number | null = null;

  const intervalId = window.setInterval(() => {
    tries += 1;
    const root = el.shadowRoot;
    if (root && apply(root)) {
      window.clearInterval(intervalId);

      observer = new MutationObserver(() => {
        if (pendingTimeout) window.clearTimeout(pendingTimeout);
        pendingTimeout = window.setTimeout(() => {
          if (el.shadowRoot) apply(el.shadowRoot);
        }, 300);
      });

      observer.observe(root, { childList: true, subtree: true });
    } else if (tries > 120) {
      window.clearInterval(intervalId);
    }
  }, 250);

  return () => {
    window.clearInterval(intervalId);
    if (pendingTimeout) window.clearTimeout(pendingTimeout);
    observer?.disconnect();
  };
}
