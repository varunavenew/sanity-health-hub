/**
 * Custom CMedical SVG icons.
 *
 * Designed to match Lucide's API:
 *   - 24×24 viewBox
 *   - stroke="currentColor", strokeWidth=1.5, fill="none"
 *   - round line caps & joins
 *   - accepts size, color, strokeWidth, className via props (LucideProps-compatible)
 *
 * Same "functional icon" rule applies — render at 16–24px next to text.
 */
import { forwardRef, type SVGProps } from "react";

export interface CustomIconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number | string;
  strokeWidth?: number | string;
}

const base = (
  size: CustomIconProps["size"] = 24,
  strokeWidth: CustomIconProps["strokeWidth"] = 1.5,
) => ({
  xmlns: "http://www.w3.org/2000/svg",
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** Gynecology — uterus + ovaries, simplified. */
export const GynecologyIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, strokeWidth, ...rest }, ref) => (
    <svg ref={ref} {...base(size, strokeWidth)} {...rest}>
      {/* uterus body */}
      <path d="M9 9c0 4 -2 6 -2 8a3 3 0 0 0 6 0v-2" />
      <path d="M15 9c0 4 2 6 2 8a3 3 0 0 1 -6 0v-2" />
      {/* fallopian tubes top */}
      <path d="M9 9c-1.5 -1.5 -3 -2 -4.5 -2" />
      <path d="M15 9c1.5 -1.5 3 -2 4.5 -2" />
      {/* ovaries */}
      <circle cx="4" cy="6.5" r="1.2" />
      <circle cx="20" cy="6.5" r="1.2" />
      {/* cervix line */}
      <path d="M9 9h6" />
    </svg>
  ),
);
GynecologyIcon.displayName = "GynecologyIcon";

/** Fertility — embryo / new life inside protective curve. */
export const FertilityIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, strokeWidth, ...rest }, ref) => (
    <svg ref={ref} {...base(size, strokeWidth)} {...rest}>
      {/* outer protective drop / womb shape */}
      <path d="M12 3c-4 4 -7 7 -7 11a7 7 0 0 0 14 0c0 -4 -3 -7 -7 -11z" />
      {/* inner embryo cells */}
      <circle cx="10.5" cy="13" r="1.3" />
      <circle cx="13.5" cy="14.5" r="1.3" />
    </svg>
  ),
);
FertilityIcon.displayName = "FertilityIcon";

/** Robot surgery — robotic arm with precision tip over a target. */
export const RobotSurgeryIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, strokeWidth, ...rest }, ref) => (
    <svg ref={ref} {...base(size, strokeWidth)} {...rest}>
      {/* ceiling mount */}
      <path d="M5 3h6" />
      {/* upper arm segment */}
      <path d="M8 3v5l5 4" />
      {/* joint */}
      <circle cx="13" cy="12" r="1.2" />
      {/* lower arm to instrument tip */}
      <path d="M13 12l4 4" />
      {/* instrument */}
      <path d="M17 16l2 2" />
      {/* target / patient point */}
      <circle cx="7" cy="19" r="2.5" />
      <path d="M7 17.5v3M5.5 19h3" />
    </svg>
  ),
);
RobotSurgeryIcon.displayName = "RobotSurgeryIcon";
