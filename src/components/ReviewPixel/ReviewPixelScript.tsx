import Script from "next/script";

// Verbatim vendor snippet (onlinerep.goldstars.no / revw.me). Self-contained
// per embed block; guards against double-injection via `window.EMRPixel`.
// next/script dedupes by `id` when badge + slider mount on the same page.
// Requires HTTPS — plain http://localhost will fail widget API calls.
const REVIEW_PIXEL_INIT = `
!function(){
  var e,t=document;
  e=function(){
    if(window.EMRPixel)
      return console.info("EMR: Pixel already loaded");

    var e=t.createElement("script");
    e.defer=!0;
    e.src="https://cdn2.revw.me/js/pixel.js?t="+864e5*Math.ceil(new Date/864e5);

    var n=t.getElementsByTagName("script")[0];
    n.charset="utf-8";
    n.parentNode.insertBefore(e,n);

    e.onload=function(){
      EMRPixel.init("onlinerep.goldstars.no",87)
    }
  };

  "interactive"===t.readyState||"complete"===t.readyState
    ? e()
    : t.addEventListener("DOMContentLoaded",e)
}();
`;

export function ReviewPixelScript() {
  return (
    <Script id="emr-review-pixel" strategy="afterInteractive">
      {REVIEW_PIXEL_INIT}
    </Script>
  );
}
