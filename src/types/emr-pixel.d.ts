import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * Custom elements provided by the Review Pixel (revw.me) third-party script.
 * Declared as JSX intrinsics so they can be used directly in TSX without
 * `any`/`ts-ignore`. See src/components/ReviewPixel/ReviewPixelScript.tsx
 * for the loader that defines these elements at runtime.
 */
type EmrWidgetProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  "widget-id": string;
};

declare global {
  interface Window {
    EMRPixel?: {
      init: (domain: string, id: number) => void;
    };
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "emr-simple-slider": EmrWidgetProps;
      "emr-simple-badge": EmrWidgetProps;
    }
  }
}

export {};
