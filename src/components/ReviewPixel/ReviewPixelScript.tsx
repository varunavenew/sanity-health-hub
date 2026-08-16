import Script from "next/script";

// Verbatim vendor snippet (onlinerep.goldstars.no / revw.me). It already
// guards against double-injection via `window.EMRPixel`, and next/script
// dedupes by `id` across rerenders and client-side navigation, so mounting
// this once in the root layout is enough for the whole app.
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
