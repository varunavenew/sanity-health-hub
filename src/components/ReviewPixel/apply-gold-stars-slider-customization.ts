import {
  GOLD_STARS_SLIDER_MAX_CARDS,
  GOLD_STARS_SLIDER_MAX_LINES,
  GOLD_STARS_SLIDER_SPEED_PX_S,
} from "./gold-stars-slider-config";

type EmrReviewVm = {
  openReadMoreModal?: (review: unknown) => void;
  reviews?: unknown[];
  $children?: EmrReviewVm[];
};

function buildGoldStarsSliderCss(maxLines: number): string {
  return [
    ".emr-w-simple-slider { width: 100vw !important; max-width: 100vw !important; margin-left: calc(50% - 50vw) !important; }",
    ".emr-w-simple-slider, .emr-w-simple-slider-container, .emr-w-simple-slider-wrapper, .emr-w-simple-slider-wrapper-top { background: transparent !important; padding: 0 !important; }",
    ".emr-w-simple-slider, .emr-w-simple-slider-container, .emr-w-simple-slider-wrapper, .emr-w-simple-slider-wrapper-top, .emr-w-simple-slider-reviews-wrapper { height: auto !important; max-height: none !important; min-height: 0 !important; }",
    ".emr-w-simple-slider-wrapper { max-width: none !important; }",
    ".emr-w-simple-slider-wrapper-top { overflow: hidden !important; margin: 0 !important; }",
    ".emr-w-simple-slider-arrow-left, .emr-w-simple-slider-arrow-right { display: none !important; }",
    ".emr-w-simple-slider-reviews-wrapper { overflow: hidden !important; }",
    ".emr-w-simple-slider-reviews-wrapper .emr-w-simple-slider-reviews { display: flex !important; align-items: stretch !important; width: max-content !important; height: auto !important; max-height: none !important; overflow: visible !important; transition: none !important; }",
    ".emr-w-simple-slider-reviews-wrapper .emr-w-simple-slider-reviews.cmgs-marquee { animation: cmgs-scroll var(--cmgs-dur, 30s) linear infinite; }",
    ".emr-w-simple-slider-reviews-wrapper .emr-w-simple-slider-reviews.cmgs-marquee:hover { animation-play-state: paused; }",
    ".emr-w-simple-slider-reviews-wrapper .emr-w-simple-slider-reviews.cmgs-modal-open { animation-play-state: paused !important; }",
    "@keyframes cmgs-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }",
    "@media (prefers-reduced-motion: reduce) { .emr-w-simple-slider-reviews-wrapper .emr-w-simple-slider-reviews.cmgs-marquee { animation: none; } }",
    ".emr-w-simple-slider-review { position: relative; display: flex !important; flex-direction: column; width: 380px !important; flex: 0 0 380px; min-height: 19rem; box-sizing: border-box; padding: 2rem !important; margin: 0 1.5rem 0 0 !important; background: #fff !important; border: 1px solid rgba(66,51,42,.1) !important; border-radius: 0.625rem !important; box-shadow: none !important; height: auto !important; cursor: pointer; }",
    ".emr-w-simple-slider-review.cmgs-empty, .emr-w-simple-slider-review.cmgs-hide { display: none !important; }",
    ".emr-w-simple-slider-stars { margin-bottom: 1rem; }",
    ".emr-w-simple-slider-stars svg { width: 1rem !important; height: 1rem !important; }",
    ".emr-w-simple-slider-review-time { display: none !important; }",
    ".emr-w-simple-slider-message-container { flex: 1 1 auto; min-height: 0 !important; overflow: hidden !important; max-height: none !important; }",
    `.emr-w-simple-slider-message { display: -webkit-box !important; -webkit-box-orient: vertical !important; -webkit-line-clamp: ${maxLines}; overflow: hidden !important; max-height: none !important; white-space: normal !important; }`,
    '.emr-w-simple-slider-message, .emr-w-simple-slider-message span { font-family: "ABC Ginto Normal", -apple-system, system-ui, "Segoe UI", sans-serif !important; font-size: 1rem !important; font-weight: 300 !important; line-height: 1.625 !important; color: #42332A !important; }',
    ".emr-w-simple-slider-author { margin-top: auto !important; padding-top: 1rem !important; border-top: 1px solid rgba(66,51,42,.1) !important; display: grid !important; grid-template-columns: 1fr auto; column-gap: 0.75rem; align-items: center; }",
    ".emr-w-simple-slider-avatar, .emr-verified-review { display: none !important; }",
    '.emr-w-simple-slider-author > span:not(.emr-verified-review):not(.cm-src-label) { grid-column: 1; grid-row: 1; font-family: "ABC Ginto Normal", -apple-system, system-ui, "Segoe UI", sans-serif !important; font-size: 1rem !important; font-weight: 400 !important; color: #42332A !important; }',
    '.emr-w-simple-slider-author .emr-w-simple-slider-review-time { display: block !important; position: static !important; grid-column: 1; grid-row: 2; margin-top: 0.125rem; font-family: "ABC Ginto Normal", -apple-system, system-ui, "Segoe UI", sans-serif !important; font-size: 0.75rem !important; font-weight: 300 !important; color: rgba(66,51,42,.6) !important; text-align: left !important; }',
    ".emr-w-simple-slider-author .emr-w-simple-slider-source { grid-column: 2; grid-row: 1 / span 2; display: flex !important; align-items: center; gap: 0.375rem; position: static !important; margin: 0 !important; }",
    ".emr-w-simple-slider-author .emr-w-simple-slider-source img { width: 1rem !important; height: 1rem !important; display: block; }",
    '.emr-w-simple-slider-author .emr-w-simple-slider-source .cm-src-label { font-family: "ABC Ginto Normal", -apple-system, system-ui, "Segoe UI", sans-serif; font-size: 0.75rem; font-weight: 400; color: rgba(66,51,42,.75); }',
    '.emr-review-modal-content { font-family: "ABC Ginto Normal", -apple-system, system-ui, "Segoe UI", sans-serif !important; border-radius: 0.625rem !important; }',
    ".emr-review-modal-message { color: #42332A !important; font-weight: 300; line-height: 1.625; }",
    "@media (max-width: 767px) { .emr-w-simple-slider-review { width: min(85vw, 340px) !important; flex: 0 0 auto; min-height: 0; } }",
  ].join("\n");
}

const CSS = buildGoldStarsSliderCss(GOLD_STARS_SLIDER_MAX_LINES);

function getVm(root: ShadowRoot): EmrReviewVm | null {
  const mountEl = root.querySelector(".emr-w-simple-slider") as
    | (HTMLElement & { __vue__?: EmrReviewVm })
    | null;
  const vm = mountEl?.__vue__;
  if (!vm) return null;

  const queue: EmrReviewVm[] = [vm];
  let n = 0;
  while (queue.length && n < 200) {
    const current = queue.shift();
    n += 1;
    if (!current) continue;
    if (current.openReadMoreModal && current.reviews) return current;
    (current.$children || []).forEach((child) => queue.push(child));
  }

  return vm.openReadMoreModal ? vm : null;
}

function apply(root: ShadowRoot): boolean {
  const track = root.querySelector(
    ".emr-w-simple-slider-reviews-wrapper .emr-w-simple-slider-reviews",
  ) as HTMLElement | null;
  if (!track || track.children.length < 2) return false;
  if (track.dataset.cmgsApplied === "1" && root.querySelector("#cmgs-style")) return true;

  Array.from(track.children).forEach((child) => {
    if (child.getAttribute("aria-hidden") === "true") child.remove();
  });

  let shown = 0;
  Array.from(track.children).forEach((card) => {
    if (!(card instanceof HTMLElement)) return;

    if (!card.dataset.cmgsFixed) {
      const author = card.querySelector(".emr-w-simple-slider-author");
      const time = card.querySelector(".emr-w-simple-slider-review-time");
      const source = card.querySelector(".emr-w-simple-slider-source");

      if (author && time) {
        const timeParent = time.parentElement;
        author.appendChild(time);
        if (timeParent && timeParent.children.length === 0 && !timeParent.className) {
          timeParent.remove();
        }
      }

      if (author && source) {
        const img = source.querySelector("img");
        if (img && !source.querySelector(".cm-src-label")) {
          const label = document.createElement("span");
          label.className = "cm-src-label";
          const srcUrl = (img.currentSrc || img.src || "").toLowerCase();
          label.textContent =
            srcUrl.indexOf("legelisten") > -1
              ? "Legelisten"
              : srcUrl.indexOf("google") > -1
                ? "Google"
                : img.alt || "";
          source.appendChild(label);
        }
        author.appendChild(source);
      }

      const nameSpan = author?.querySelector(
        "span:not(.emr-verified-review):not(.cm-src-label)",
      );
      if (nameSpan && nameSpan.textContent?.trim() === "") {
        nameSpan.textContent = "Anonym";
      }

      card.dataset.cmgsFixed = "1";
    }

    const messageSpan = card.querySelector(".emr-w-simple-slider-message span");
    const empty = !messageSpan || messageSpan.textContent?.trim().length === 0;
    card.classList.toggle("cmgs-empty", empty);
    const hide = !empty && shown >= GOLD_STARS_SLIDER_MAX_CARDS;
    card.classList.toggle("cmgs-hide", hide);
    if (!empty && !hide) shown += 1;
  });

  track.dataset.cmgsApplied = "1";

  root.querySelector("#cmgs-style")?.remove();
  const style = document.createElement("style");
  style.id = "cmgs-style";
  style.textContent = CSS;
  root.appendChild(style);

  [
    ".emr-w-simple-slider",
    ".emr-w-simple-slider-container",
    ".emr-w-simple-slider-wrapper",
    ".emr-w-simple-slider-wrapper-top",
    ".emr-w-simple-slider-reviews-wrapper",
  ].forEach((selector) => {
    root.querySelectorAll(selector).forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      node.style.setProperty("height", "auto", "important");
      node.style.setProperty("max-height", "none", "important");
    });
  });

  Array.from(track.children).forEach((child) => {
    const clone = child.cloneNode(true) as HTMLElement;
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  if (!track.dataset.cmgsClick) {
    track.dataset.cmgsClick = "1";
    let downX = 0;
    let downY = 0;
    let moved = false;

    const tryOpen = (targetEl: EventTarget | null) => {
      if (root.querySelector(".emr-review-modal-overlay")) return;
      if (Date.now() - Number(track.dataset.cmgsLastOpen || 0) < 400) return;

      const card =
        targetEl instanceof Element
          ? targetEl.closest(".emr-w-simple-slider-review")
          : null;
      if (!card) return;

      const all = Array.from(track.children);
      const originals = all.filter((child) => child.getAttribute("aria-hidden") !== "true");
      const idx =
        card.getAttribute("aria-hidden") === "true"
          ? all
              .filter((child) => child.getAttribute("aria-hidden") === "true")
              .indexOf(card)
          : originals.indexOf(card);

      const vm = getVm(root);
      if (vm?.openReadMoreModal && vm.reviews?.[idx]) {
        track.dataset.cmgsLastOpen = String(Date.now());
        vm.openReadMoreModal(vm.reviews[idx]);
      } else {
        const message = (originals[idx] || card).querySelector(".emr-w-simple-slider-message");
        if (message instanceof HTMLElement) message.click();
      }
    };

    track.addEventListener(
      "pointerdown",
      (event) => {
        downX = event.clientX;
        downY = event.clientY;
        moved = false;
      },
      true,
    );
    track.addEventListener(
      "pointermove",
      (event) => {
        if (Math.abs(event.clientX - downX) + Math.abs(event.clientY - downY) > 8) {
          moved = true;
        }
      },
      true,
    );
    track.addEventListener(
      "click",
      (event) => {
        if (!moved) tryOpen(event.target);
      },
      true,
    );
    track.addEventListener(
      "pointerup",
      (event) => {
        if (event.button !== 0 || moved) return;
        const target = event.target;
        window.setTimeout(() => tryOpen(target), 60);
      },
      true,
    );
  }

  track.classList.remove("cmgs-marquee");
  void track.offsetWidth;
  const half = track.scrollWidth / 2;
  track.style.setProperty(
    "--cmgs-dur",
    `${Math.max(20, Math.round(half / GOLD_STARS_SLIDER_SPEED_PX_S))}s`,
  );
  track.classList.add("cmgs-marquee");
  return true;
}

export function setupGoldStarsSliderCustomization(el: HTMLElement): () => void {
  let tries = 0;
  let observer: MutationObserver | null = null;
  let pendingTimeout: ReturnType<typeof window.setTimeout> | null = null;

  const intervalId = window.setInterval(() => {
    tries += 1;
    const root = el.shadowRoot;
    if (root && apply(root)) {
      window.clearInterval(intervalId);

      observer = new MutationObserver(() => {
        if (!el.shadowRoot) return;
        const track = el.shadowRoot.querySelector(
          ".emr-w-simple-slider-reviews-wrapper .emr-w-simple-slider-reviews",
        ) as HTMLElement | null;
        if (track) {
          track.classList.toggle(
            "cmgs-modal-open",
            Boolean(el.shadowRoot.querySelector(".emr-review-modal-overlay")),
          );
        }

        if (pendingTimeout) window.clearTimeout(pendingTimeout);
        pendingTimeout = window.setTimeout(() => {
          const shadowRoot = el.shadowRoot;
          if (!shadowRoot) return;
          const nextTrack = shadowRoot.querySelector(
            ".emr-w-simple-slider-reviews-wrapper .emr-w-simple-slider-reviews",
          ) as HTMLElement | null;
          if (nextTrack && nextTrack.dataset.cmgsApplied !== "1") {
            apply(shadowRoot);
          }
        }, 400);
      });

      observer.observe(el.shadowRoot, { childList: true, subtree: true });
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
