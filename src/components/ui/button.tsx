import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button Design System — CTA Guidelines
 * ─────────────────────────────────────────
 * Primary CTA:      variant="cta"              — Accent/yellow button, used for main actions on LIGHT backgrounds
 * Secondary CTA:    variant="cta-outline"       — Outlined button, used alongside a primary CTA on LIGHT backgrounds
 * Dark bg primary:  variant="cta-dark"          — White button on dark backgrounds (hero, brand-dark sections)
 * Dark bg secondary:variant="cta-outline-dark"  — Semi-transparent white outline on dark backgrounds
 *
 * RULE: On dark backgrounds (bg-brand-dark, hero images), NEVER use "cta" (yellow).
 *       Use "cta-dark" for primary and "cta-outline-dark" for secondary.
 * Standard variants (default, outline, ghost, link, secondary) remain for non-CTA UI elements.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rounded-2xl md:rounded-md bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground",
        destructive: "rounded-2xl md:rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "rounded-2xl md:rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent",
        secondary: "rounded-2xl md:rounded-md bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "rounded-2xl md:rounded-md hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-accent",
        // ── CTA variants (standardised across the entire site) ──
        cta: "rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90",
        "cta-outline": "rounded-2xl border border-current bg-transparent hover:bg-foreground/5",
        "cta-outline-dark": "rounded-2xl border border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-brand-dark transition-colors",
        "cta-dark": "rounded-2xl bg-white text-brand-dark hover:bg-white/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-2xl md:rounded-md px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * MOBILE BUTTON STANDARD (< 640px)
 * Every real button (not icon buttons, not small utility buttons, not text links)
 * renders full width with the same height/radius as the "Bestill time hos spesialist"
 * section CTAs ("Bestill time nå" / "Ring oss"): h-12, rounded-2xl, one per line.
 * Opt out per instance with `max-sm:w-auto` in className (className wins in cn()).
 */
const MOBILE_STANDARD = "max-sm:w-full max-sm:h-12 max-sm:px-6 max-sm:rounded-2xl";

function isMobileStandard(variant?: string | null, size?: string | null) {
  const s = size ?? "default";
  const v = variant ?? "default";
  if (s === "icon" || s === "sm") return false;
  if (v === "link") return false;
  if (v === "ghost") return s === "lg";
  return s === "default" || s === "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          isMobileStandard(variant, size) && MOBILE_STANDARD,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
