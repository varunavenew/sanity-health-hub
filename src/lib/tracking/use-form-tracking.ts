"use client";

import { useCallback, useRef } from "react";
import { trackFormStart } from "@/lib/tracking/form-events";

/** Fire form_start once per mount when the user first interacts with a form field. */
export function useFormTracking(formName: string, formLocation: string) {
  const startedRef = useRef(false);

  const onFieldInteraction = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFormStart({ form_name: formName, form_location: formLocation });
  }, [formName, formLocation]);

  return { onFieldInteraction };
}
