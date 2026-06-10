/**
 * Custom CMedical SVG icons.
 *
 * Designed to match Lucide's API:
 *   - 24×24 viewBox
 *   - stroke="currentColor", strokeWidth=1.5, fill="none"
 *   - round line caps & joins
 *   - accepts size, color, strokeWidth, className via props
 *
 * Same "functional icon" rule applies — render at 16–24px next to text.
 *
 * Naming follows kebab-case keys used in getIcon().
 */
import { forwardRef, type ReactElement, type SVGProps } from "react";

export interface CustomIconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number | string;
  strokeWidth?: number | string;
}

const baseProps = (
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

type IconFC = ReturnType<typeof forwardRef<SVGSVGElement, CustomIconProps>>;

const make = (
  name: string,
  draw: (b: ReturnType<typeof baseProps>) => ReactElement,
): IconFC => {
  const C = forwardRef<SVGSVGElement, CustomIconProps>(
    ({ size, strokeWidth, ...rest }, ref) => {
      const b = baseProps(size, strokeWidth);
      return (
        <svg ref={ref} {...b} {...rest}>
          {draw(b)}
        </svg>
      );
    },
  );
  C.displayName = name;
  return C;
};

/* =========================================================================
 * MEDICAL / SPECIALITY (CMedical-spesifikke)
 * ========================================================================= */

export const GynecologyIcon = make("GynecologyIcon", () => (
  <>
    {/* uterus body */}
    <path d="M9 9c0 4 -2 6 -2 8a3 3 0 0 0 6 0v-2" />
    <path d="M15 9c0 4 2 6 2 8a3 3 0 0 1 -6 0v-2" />
    {/* fallopian tubes */}
    <path d="M9 9c-1.5 -1.5 -3 -2 -4.5 -2" />
    <path d="M15 9c1.5 -1.5 3 -2 4.5 -2" />
    {/* ovaries */}
    <circle cx="4" cy="6.5" r="1.2" />
    <circle cx="20" cy="6.5" r="1.2" />
    {/* cervix */}
    <path d="M9 9h6" />
  </>
));

export const FertilityIcon = make("FertilityIcon", () => (
  <>
    {/* Variant 3 — Reise: myk buet linje med målpunkt */}
    <path d="M5.5 16 Q9 9.5 12 12 Q15 14.5 17 8.5" />
    <circle cx="17" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
  </>
));

export const RobotSurgeryIcon = make("RobotSurgeryIcon", () => (
  <>
    <path d="M5 3h6" />
    <path d="M8 3v5l5 4" />
    <circle cx="13" cy="12" r="1.2" />
    <path d="M13 12l4 4" />
    <path d="M17 16l2 2" />
    <circle cx="7" cy="19" r="2.5" />
    <path d="M7 17.5v3M5.5 19h3" />
  </>
));

export const UrologyIcon = make("UrologyIcon", () => (
  <>
    {/* kidney shape */}
    <path d="M8 4c-3 0 -5 3 -5 7s2 9 5 9c2 0 3 -2 4 -2s2 2 4 2c3 0 5 -5 5 -9s-2 -7 -5 -7c-2 0 -3 2 -4 2s-2 -2 -4 -2z" />
    {/* inner detail */}
    <path d="M9 11c1 1 2 1 3 1s2 0 3 -1" />
  </>
));

export const PregnancyIcon = make("PregnancyIcon", () => (
  <>
    {/* head */}
    <circle cx="12" cy="5" r="2" />
    {/* body with belly */}
    <path d="M12 7v3" />
    <path d="M12 10c-3 0 -5 2 -5 5s2 5 5 5c3 0 5 -2 5 -5s-2 -5 -5 -5z" />
    {/* baby curl inside */}
    <path d="M11 14c1 0 1 1 2 1" />
    {/* legs */}
    <path d="M10 20v2M14 20v2" />
  </>
));

export const MenopauseIcon = make("MenopauseIcon", () => (
  <>
    {/* sun + woman symbol = warmth/transition */}
    <circle cx="12" cy="9" r="3" />
    <path d="M12 12v5" />
    <path d="M9.5 15h5" />
    {/* warmth rays */}
    <path d="M12 3v1.5M5 9H3.5M20.5 9H19M6.5 4l1 1M17.5 4l-1 1" />
  </>
));

export const UltrasoundIcon = make("UltrasoundIcon", () => (
  <>
    {/* probe head */}
    <path d="M5 3h4l2 4v3H5z" />
    <path d="M5 10v3h6V10" />
    {/* sound waves */}
    <path d="M14 8a6 6 0 0 1 0 8" />
    <path d="M17 6a10 10 0 0 1 0 12" />
    <path d="M20 4a14 14 0 0 1 0 16" />
  </>
));

export const ConsultationIcon = make("ConsultationIcon", () => (
  <>
    {/* two heads facing each other */}
    <circle cx="7" cy="8" r="2.5" />
    <circle cx="17" cy="8" r="2.5" />
    <path d="M3 19c0 -2.5 1.8 -4.5 4 -4.5s4 2 4 4.5" />
    <path d="M13 19c0 -2.5 1.8 -4.5 4 -4.5s4 2 4 4.5" />
    {/* dialog dot between */}
    <circle cx="12" cy="9" r="0.6" fill="currentColor" stroke="none" />
  </>
));

export const GpDoctorIcon = make("GpDoctorIcon", () => (
  <>
    {/* doctor head */}
    <circle cx="12" cy="7" r="3" />
    {/* coat */}
    <path d="M5 21v-3c0 -3 3 -5 7 -5s7 2 7 5v3" />
    {/* stethoscope cross on chest */}
    <path d="M11 16h2M12 15v2" />
  </>
));

export const InsuranceShieldIcon = make("InsuranceShieldIcon", () => (
  <>
    <path d="M12 3l8 3v6c0 4.5 -3.5 8 -8 9c-4.5 -1 -8 -4.5 -8 -9V6l8 -3z" />
    {/* cross inside */}
    <path d="M12 9v6M9 12h6" />
  </>
));

export const PrivateClinicIcon = make("PrivateClinicIcon", () => (
  <>
    {/* building */}
    <path d="M4 21V8l8 -5l8 5v13" />
    <path d="M4 21h16" />
    {/* medical cross */}
    <path d="M12 11v5M9.5 13.5h5" />
    {/* door */}
    <path d="M10 21v-3h4v3" />
  </>
));

export const TreatmentPlanIcon = make("TreatmentPlanIcon", () => (
  <>
    {/* clipboard */}
    <path d="M8 4h8v3H8z" />
    <path d="M6 6h2M16 6h2" />
    <path d="M6 6v15h12V6" />
    {/* checklist */}
    <path d="M9 11l1.5 1.5L13 10" />
    <path d="M9 16l1.5 1.5L13 15" />
  </>
));

export const BeforeAfterIcon = make("BeforeAfterIcon", () => (
  <>
    {/* split circle */}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v18" />
    {/* arrows showing transformation */}
    <path d="M5 12h2M17 12h2" />
  </>
));

export const ConfidentialIcon = make("ConfidentialIcon", () => (
  <>
    {/* padlock with heart */}
    <rect x="5" y="11" width="14" height="9" rx="1" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    <path d="M12 17c-1.5 -1 -2.5 -2 -2.5 -3a1 1 0 0 1 2.5 -0.5a1 1 0 0 1 2.5 0.5c0 1 -1 2 -2.5 3z" />
  </>
));

/* =========================================================================
 * NAVIGATION / UI — custom-tegnet i samme tynne stil
 * ========================================================================= */

export const ArrowRightLineIcon = make("ArrowRightLineIcon", () => (
  <>
    <path d="M4 12h15" />
    <path d="M14 7l5 5l-5 5" />
  </>
));

export const ArrowLeftLineIcon = make("ArrowLeftLineIcon", () => (
  <>
    <path d="M20 12H5" />
    <path d="M10 7l-5 5l5 5" />
  </>
));

export const ArrowUpRightLineIcon = make("ArrowUpRightLineIcon", () => (
  <>
    <path d="M7 17L17 7" />
    <path d="M9 7h8v8" />
  </>
));

export const ChevronRightThinIcon = make("ChevronRightThinIcon", () => (
  <path d="M9 6l6 6l-6 6" />
));

export const ChevronLeftThinIcon = make("ChevronLeftThinIcon", () => (
  <path d="M15 6l-6 6l6 6" />
));

export const ChevronDownThinIcon = make("ChevronDownThinIcon", () => (
  <path d="M6 9l6 6l6 -6" />
));

export const ChevronUpThinIcon = make("ChevronUpThinIcon", () => (
  <path d="M6 15l6 -6l6 6" />
));

export const PlusThinIcon = make("PlusThinIcon", () => (
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>
));

export const MinusThinIcon = make("MinusThinIcon", () => (
  <path d="M5 12h14" />
));

export const CheckThinIcon = make("CheckThinIcon", () => (
  <path d="M5 12.5l4.5 4.5L19 7" />
));

export const CheckCircleThinIcon = make("CheckCircleThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l3 3l5 -6" />
  </>
));

export const CloseThinIcon = make("CloseThinIcon", () => (
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6l-12 12" />
  </>
));

export const SearchThinIcon = make("SearchThinIcon", () => (
  <>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4.5 -4.5" />
  </>
));

export const MenuThinIcon = make("MenuThinIcon", () => (
  <>
    <path d="M4 7h16" />
    <path d="M4 17h16" />
  </>
));

export const ExternalLinkThinIcon = make("ExternalLinkThinIcon", () => (
  <>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M19 14v5a1 1 0 0 1 -1 1H6a1 1 0 0 1 -1 -1V7a1 1 0 0 1 1 -1h5" />
  </>
));

/* =========================================================================
 * CONTACT / LOCATION
 * ========================================================================= */

export const PhoneThinIcon = make("PhoneThinIcon", () => (
  <path d="M5 4h3l2 5l-2.5 1.5a11 11 0 0 0 6 6l1.5 -2.5l5 2v3a2 2 0 0 1 -2 2A16 16 0 0 1 3 6a2 2 0 0 1 2 -2z" />
));

export const MailThinIcon = make("MailThinIcon", () => (
  <>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="M3 7l9 7l9 -7" />
  </>
));

export const MapPinThinIcon = make("MapPinThinIcon", () => (
  <>
    <path d="M12 22c-4 -5 -7 -8.5 -7 -13a7 7 0 0 1 14 0c0 4.5 -3 8 -7 13z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </>
));

export const ClockThinIcon = make("ClockThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>
));

export const CalendarThinIcon = make("CalendarThinIcon", () => (
  <>
    <rect x="4" y="5" width="16" height="16" rx="1" />
    <path d="M4 10h16" />
    <path d="M9 3v4M15 3v4" />
  </>
));

export const BuildingThinIcon = make("BuildingThinIcon", () => (
  <>
    <rect x="5" y="3" width="14" height="18" rx="1" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    <path d="M10 21v-3h4v3" />
  </>
));

/* =========================================================================
 * PEOPLE / CARE
 * ========================================================================= */

export const UserThinIcon = make("UserThinIcon", () => (
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 21c0 -3.5 3 -6 7 -6s7 2.5 7 6" />
  </>
));

export const UsersThinIcon = make("UsersThinIcon", () => (
  <>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 21c0 -3 2.5 -5.5 6 -5.5s6 2.5 6 5.5" />
    <path d="M15 21c0 -2.5 2 -4.5 4 -4.5" />
  </>
));

export const UserCheckThinIcon = make("UserCheckThinIcon", () => (
  <>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3 21c0 -3.5 2.7 -6 6 -6s6 2.5 6 6" />
    <path d="M16 12l2 2l4 -4" />
  </>
));

export const BabyThinIcon = make("BabyThinIcon", () => (
  <>
    <circle cx="12" cy="9" r="4" />
    <path d="M10 9h0.01M14 9h0.01" fill="currentColor" />
    <path d="M10 11c1 1 3 1 4 0" />
    {/* swaddle */}
    <path d="M5 21c0 -4 3 -6 7 -6s7 2 7 6" />
  </>
));

export const HeartThinIcon = make("HeartThinIcon", () => (
  <path d="M12 20c-5 -3 -9 -6 -9 -11a4.5 4.5 0 0 1 9 -1a4.5 4.5 0 0 1 9 1c0 5 -4 8 -9 11z" />
));

export const HandHeartThinIcon = make("HandHeartThinIcon", () => (
  <>
    {/* heart */}
    <path d="M12 9c-2 -2 -5 -1 -5 1.5c0 2 3 3.5 5 5c2 -1.5 5 -3 5 -5c0 -2.5 -3 -3.5 -5 -1.5z" />
    {/* hand cup */}
    <path d="M3 16c2 0 3 1 4 2l5 1l5 -1c1 -1 2 -2 4 -2v4H3z" />
  </>
));

/* =========================================================================
 * INFO / TRUST
 * ========================================================================= */

export const InfoThinIcon = make("InfoThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" />
  </>
));

export const StarThinIcon = make("StarThinIcon", () => (
  <path d="M12 3l2.7 5.5l6.1 0.9l-4.4 4.3l1 6l-5.4 -2.8l-5.4 2.8l1 -6l-4.4 -4.3l6.1 -0.9z" />
));

export const AwardThinIcon = make("AwardThinIcon", () => (
  <>
    <circle cx="12" cy="9" r="6" />
    <path d="M12 9l-2 -1.5l1 -2.5h2l1 2.5z" />
    <path d="M9 14l-2 7l5 -3l5 3l-2 -7" />
  </>
));

export const ShieldThinIcon = make("ShieldThinIcon", () => (
  <path d="M12 3l8 3v6c0 4.5 -3.5 8 -8 9c-4.5 -1 -8 -4.5 -8 -9V6l8 -3z" />
));

export const ShieldCheckThinIcon = make("ShieldCheckThinIcon", () => (
  <>
    <path d="M12 3l8 3v6c0 4.5 -3.5 8 -8 9c-4.5 -1 -8 -4.5 -8 -9V6l8 -3z" />
    <path d="M9 12l2 2l4 -4" />
  </>
));

export const FileTextThinIcon = make("FileTextThinIcon", () => (
  <>
    <path d="M14 3H6a1 1 0 0 0 -1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1V8z" />
    <path d="M14 3v5h5" />
    <path d="M8 13h8M8 16h8M8 19h5" />
  </>
));

export const FileCheckThinIcon = make("FileCheckThinIcon", () => (
  <>
    <path d="M14 3H6a1 1 0 0 0 -1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1V8z" />
    <path d="M14 3v5h5" />
    <path d="M8 14l2 2l5 -5" />
  </>
));

export const BookOpenThinIcon = make("BookOpenThinIcon", () => (
  <>
    <path d="M3 5h7c1 0 2 1 2 2v13c0 -1 -1 -2 -2 -2H3z" />
    <path d="M21 5h-7c-1 0 -2 1 -2 2v13c0 -1 1 -2 2 -2h7z" />
  </>
));

export const SparklesThinIcon = make("SparklesThinIcon", () => (
  <>
    <path d="M10 3l1.5 4.5L16 9l-4.5 1.5L10 15l-1.5 -4.5L4 9l4.5 -1.5z" />
    <path d="M18 14l0.7 2L21 17l-2.3 0.7L18 20l-0.7 -2.3L15 17l2.3 -1z" />
  </>
));

export const QuoteThinIcon = make("QuoteThinIcon", () => (
  <>
    <path d="M7 7h3v6H4V10c0 -1.5 1 -3 3 -3z" />
    <path d="M17 7h3v6h-6V10c0 -1.5 1 -3 3 -3z" />
  </>
));

export const ScaleThinIcon = make("ScaleThinIcon", () => (
  <>
    <path d="M12 4v17" />
    <path d="M5 21h14" />
    <path d="M5 7h14" />
    <path d="M5 7l-2 6a3 3 0 0 0 6 0z" />
    <path d="M19 7l-2 6a3 3 0 0 0 6 0z" />
  </>
));

/* =========================================================================
 * COMMERCE / MONEY
 * ========================================================================= */

export const CoinsThinIcon = make("CoinsThinIcon", () => (
  <>
    <ellipse cx="9" cy="8" rx="6" ry="3" />
    <path d="M3 8v4c0 1.5 2.5 3 6 3s6 -1.5 6 -3V8" />
    <path d="M9 15v3c0 1.5 2.5 3 6 3s6 -1.5 6 -3v-6c0 -1.5 -2.5 -3 -6 -3" />
  </>
));

export const CreditCardThinIcon = make("CreditCardThinIcon", () => (
  <>
    <rect x="3" y="6" width="18" height="13" rx="1" />
    <path d="M3 10h18" />
    <path d="M7 15h3" />
  </>
));

export const TagThinIcon = make("TagThinIcon", () => (
  <>
    <path d="M3 12V4a1 1 0 0 1 1 -1h8l8 8a1 1 0 0 1 0 1.5l-7 7a1 1 0 0 1 -1.5 0z" />
    <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
  </>
));

export const ShoppingBagThinIcon = make("ShoppingBagThinIcon", () => (
  <>
    <path d="M5 7h14l-1 13a1 1 0 0 1 -1 1H7a1 1 0 0 1 -1 -1z" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
  </>
));

export const PackageThinIcon = make("PackageThinIcon", () => (
  <>
    <path d="M3 7l9 -4l9 4v10l-9 4l-9 -4z" />
    <path d="M3 7l9 4l9 -4" />
    <path d="M12 11v10" />
  </>
));

export const WalletThinIcon = make("WalletThinIcon", () => (
  <>
    <rect x="3" y="6" width="18" height="14" rx="1" />
    <path d="M16 13h2" />
    <path d="M3 10c0 -2 1 -3 3 -3h12" />
  </>
));

/* =========================================================================
 * MISC / MEDIA
 * ========================================================================= */

export const CameraThinIcon = make("CameraThinIcon", () => (
  <>
    <path d="M3 8h4l2 -3h6l2 3h4v11H3z" />
    <circle cx="12" cy="13" r="3.5" />
  </>
));

export const VideoThinIcon = make("VideoThinIcon", () => (
  <>
    <rect x="3" y="6" width="13" height="12" rx="1" />
    <path d="M16 10l5 -3v10l-5 -3z" />
  </>
));

export const PlayThinIcon = make("PlayThinIcon", () => (
  <path d="M7 5l11 7l-11 7z" />
));

export const LockThinIcon = make("LockThinIcon", () => (
  <>
    <rect x="5" y="11" width="14" height="9" rx="1" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </>
));

export const SettingsThinIcon = make("SettingsThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12c0 .5 0 1 -.1 1.5l2 1.5l-2 3.5l-2.4 -.9c-.7.5 -1.5 1 -2.4 1.2L13.7 21h-3.4l-.4 -2.2c-.9 -.2 -1.7 -.7 -2.4 -1.2l-2.4 .9l-2 -3.5l2 -1.5C5 13 5 12.5 5 12s0 -1 .1 -1.5l-2 -1.5l2 -3.5l2.4 .9c.7 -.5 1.5 -1 2.4 -1.2L10.3 3h3.4l.4 2.2c.9 .2 1.7 .7 2.4 1.2l2.4 -.9l2 3.5l-2 1.5c.1 .5 .1 1 .1 1.5z" />
  </>
));

export const GlobeThinIcon = make("GlobeThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c3 3 4.5 6 4.5 9s-1.5 6 -4.5 9c-3 -3 -4.5 -6 -4.5 -9s1.5 -6 4.5 -9z" />
  </>
));

export const MicThinIcon = make("MicThinIcon", () => (
  <>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </>
));

export const SendThinIcon = make("SendThinIcon", () => (
  <>
    <path d="M21 3L3 11l7 3z" />
    <path d="M21 3l-7 18l-3 -7z" />
  </>
));

export const MessageThinIcon = make("MessageThinIcon", () => (
  <path d="M4 4h16v12H8l-4 4z" />
));

/* =========================================================================
 * MEDICAL UI EXTRA (used on site)
 * ========================================================================= */

export const StethoscopeThinIcon = make("StethoscopeThinIcon", () => (
  <>
    <path d="M5 3v6a4 4 0 0 0 8 0V3" />
    <path d="M5 3h2M11 3h2" />
    <path d="M9 13v3a4 4 0 0 0 8 0v-1" />
    <circle cx="17" cy="13" r="2" />
  </>
));

export const HeartPulseThinIcon = make("HeartPulseThinIcon", () => (
  <>
    <path d="M12 20c-5 -3 -9 -6 -9 -11a4.5 4.5 0 0 1 9 -1a4.5 4.5 0 0 1 9 1c0 5 -4 8 -9 11z" />
    <path d="M5 11h3l1.5 -3l3 6l1.5 -3h3" />
  </>
));

export const SyringeThinIcon = make("SyringeThinIcon", () => (
  <>
    <path d="M17 3l4 4" />
    <path d="M19 5l-2 2l3 3l-9 9H8v-3l9 -9z" />
    <path d="M11 11l3 3" />
  </>
));

export const PillThinIcon = make("PillThinIcon", () => (
  <>
    <rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-30 12 12)" />
    <path d="M8 8l8 8" />
  </>
));

export const ActivityThinIcon = make("ActivityThinIcon", () => (
  <path d="M3 12h4l2 -7l4 14l2 -7h6" />
));

export const MicroscopeThinIcon = make("MicroscopeThinIcon", () => (
  <>
    <path d="M9 3l4 2l-3 5l-4 -2z" />
    <path d="M10 10l4 4" />
    <path d="M7 14a5 5 0 1 0 10 0" />
    <path d="M5 21h14" />
    <path d="M9 17v4M15 17v4" />
  </>
));

export const ScanThinIcon = make("ScanThinIcon", () => (
  <>
    <path d="M3 7V5a1 1 0 0 1 1 -1h2" />
    <path d="M21 7V5a1 1 0 0 0 -1 -1h-2" />
    <path d="M3 17v2a1 1 0 0 0 1 1h2" />
    <path d="M21 17v2a1 1 0 0 1 -1 1h-2" />
    <path d="M7 12h10" />
  </>
));

export const ClipboardThinIcon = make("ClipboardThinIcon", () => (
  <>
    <path d="M9 3h6v3H9z" />
    <path d="M7 5h2M15 5h2" />
    <path d="M7 5v16h10V5" />
    <path d="M9 11h6M9 15h6M9 19h4" />
  </>
));

export const BoneThinIcon = make("BoneThinIcon", () => (
  <path d="M5 7a2.5 2.5 0 0 1 5 0c0 0 0 1 1 2l5 5c1 1 2 1 2 1a2.5 2.5 0 0 1 0 5a2.5 2.5 0 0 1 -5 0c0 0 0 -1 -1 -2l-5 -5c-1 -1 -2 -1 -2 -1a2.5 2.5 0 0 1 0 -5z" />
));

export const BrainThinIcon = make("BrainThinIcon", () => (
  <>
    <path d="M9 4a3 3 0 0 0 -3 3v1a3 3 0 0 0 -2 2.5a3 3 0 0 0 2 3a3 3 0 0 0 3 3.5h3V4z" />
    <path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 2.5a3 3 0 0 1 -2 3a3 3 0 0 1 -3 3.5h-3V4z" />
  </>
));

export const ScissorsThinIcon = make("ScissorsThinIcon", () => (
  <>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <path d="M8 8l12 12" />
    <path d="M8 16l12 -12" />
  </>
));

export const ThermometerThinIcon = make("ThermometerThinIcon", () => (
  <>
    <path d="M12 3a2 2 0 0 0 -2 2v9a4 4 0 1 0 4 0V5a2 2 0 0 0 -2 -2z" />
  </>
));

export const SmileThinIcon = make("SmileThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 14c.8 1 2 1.5 3 1.5s2.2 -.5 3 -1.5" />
    <circle cx="9" cy="10" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="0.6" fill="currentColor" stroke="none" />
  </>
));

export const AccessibilityThinIcon = make("AccessibilityThinIcon", () => (
  <>
    <circle cx="12" cy="4" r="1.5" />
    <path d="M5 8c2 1 4 1.5 7 1.5s5 -.5 7 -1.5" />
    <path d="M12 9.5v5" />
    <path d="M9 21l3 -6.5l3 6.5" />
  </>
));

export const GraduationCapThinIcon = make("GraduationCapThinIcon", () => (
  <>
    <path d="M2 9l10 -4l10 4l-10 4z" />
    <path d="M6 11v5c0 1.5 3 3 6 3s6 -1.5 6 -3v-5" />
    <path d="M22 9v6" />
  </>
));

export const BriefcaseThinIcon = make("BriefcaseThinIcon", () => (
  <>
    <rect x="3" y="7" width="18" height="13" rx="1" />
    <path d="M9 7V5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v2" />
    <path d="M3 13h18" />
  </>
));

export const TrainThinIcon = make("TrainThinIcon", () => (
  <>
    <rect x="5" y="3" width="14" height="14" rx="2" />
    <path d="M5 11h14" />
    <circle cx="9" cy="14" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="15" cy="14" r="0.6" fill="currentColor" stroke="none" />
    <path d="M7 21l2 -3M17 21l-2 -3" />
  </>
));

export const CarThinIcon = make("CarThinIcon", () => (
  <>
    <path d="M3 16v-3l2 -5h14l2 5v3" />
    <rect x="3" y="13" width="18" height="5" rx="1" />
    <circle cx="7" cy="18" r="1.5" />
    <circle cx="17" cy="18" r="1.5" />
  </>
));

export const TimerThinIcon = make("TimerThinIcon", () => (
  <>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 13V8" />
    <path d="M9 3h6" />
    <path d="M12 3v2" />
  </>
));

export const TrendingUpThinIcon = make("TrendingUpThinIcon", () => (
  <>
    <path d="M3 17l6 -6l4 4l8 -8" />
    <path d="M14 7h7v7" />
  </>
));

export const ZapThinIcon = make("ZapThinIcon", () => (
  <path d="M13 3L4 14h7l-1 7l9 -11h-7z" />
));

export const LoaderThinIcon = make("LoaderThinIcon", () => (
  <>
    <path d="M12 3v3" />
    <path d="M12 18v3" />
    <path d="M5.6 5.6l2.1 2.1" />
    <path d="M16.3 16.3l2.1 2.1" />
    <path d="M3 12h3" />
    <path d="M18 12h3" />
    <path d="M5.6 18.4l2.1 -2.1" />
    <path d="M16.3 7.7l2.1 -2.1" />
  </>
));

export const HelpCircleThinIcon = make("HelpCircleThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5 -2.5 2 -2.5 4" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
  </>
));

export const MoreHorizontalThinIcon = make("MoreHorizontalThinIcon", () => (
  <>
    <circle cx="6" cy="12" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="18" cy="12" r="0.8" fill="currentColor" stroke="none" />
  </>
));

/* =========================================================================
 * SOCIAL (custom monoline versions, simplified)
 * ========================================================================= */

export const InstagramThinIcon = make("InstagramThinIcon", () => (
  <>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </>
));

export const FacebookThinIcon = make("FacebookThinIcon", () => (
  <path d="M14 21v-8h2.5l.5 -3h-3V8a1.5 1.5 0 0 1 1.5 -1.5H17V4h-2.5A4 4 0 0 0 10.5 8v2H8v3h2.5v8z" />
));

export const LinkedinThinIcon = make("LinkedinThinIcon", () => (
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 10v7" />
    <circle cx="7" cy="7" r="0.8" fill="currentColor" stroke="none" />
    <path d="M11 17v-7" />
    <path d="M11 13c0 -2 1.5 -3 3 -3s3 1 3 3v4" />
  </>
));

export const YoutubeThinIcon = make("YoutubeThinIcon", () => (
  <>
    <rect x="2" y="6" width="20" height="13" rx="3" />
    <path d="M10 10l5 2.5l-5 2.5z" />
  </>
));

export const TwitterThinIcon = make("TwitterThinIcon", () => (
  <path d="M3 4l7.5 10L3.5 20H6l5.5 -5l4 5H21l-8 -10.5L20 4h-2.5l-4.5 4.5L9 4z" />
));

export const AppleThinIcon = make("AppleThinIcon", () => (
  <>
    <path d="M16 4c0 2 -1.5 3.5 -3 3.5" />
    <path d="M8 9c-3 0 -5 3 -5 6c0 4 3 7 5 7c1 0 2 -.5 3 -.5s2 .5 3 .5c2 0 5 -3 5 -7c0 -3 -2 -6 -5 -6c-1 0 -2 .5 -3 .5s-2 -.5 -3 -.5z" />
  </>
));

export const BotThinIcon = make("BotThinIcon", () => (
  <>
    <rect x="5" y="8" width="14" height="11" rx="2" />
    <path d="M12 5v3" />
    <circle cx="12" cy="4" r="1" />
    <circle cx="9" cy="13" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="13" r="0.8" fill="currentColor" stroke="none" />
    <path d="M9 17h6" />
  </>
));

/* =========================================================================
 * DECORATIVE / MISC
 * ========================================================================= */

export const CircleThinIcon = make("CircleThinIcon", () => (
  <circle cx="12" cy="12" r="9" />
));

export const DotThinIcon = make("DotThinIcon", () => (
  <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
));

/* =========================================================================
 * SUBSPECIALITIES — gynekologi/urologi/fertilitet undertjenester
 * ========================================================================= */

// Dråpe — urinlekkasje, vaginal tørrhet
export const DropletThinIcon = make("DropletThinIcon", () => (
  <path d="M12 3 c -3 5 -6 8 -6 11.5 a 6 6 0 0 0 12 0 C 18 11 15 8 12 3 z" />
));

// Bånd / sløyfe — endometriose (awareness ribbon)
export const RibbonThinIcon = make("RibbonThinIcon", () => (
  <>
    <path d="M9 4 L12 11 L15 4" />
    <path d="M9 4 C 7 9 7 13 10 17 L12 20 L14 17 C 17 13 17 9 15 4" />
  </>
));

// Sol — overgangsalder / menopause (varme, livsfase)
export const SunThinIcon = make("SunThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 3 v2 M12 19 v2 M3 12 h2 M19 12 h2 M5.5 5.5 l1.4 1.4 M17.1 17.1 l1.4 1.4 M5.5 18.5 l1.4 -1.4 M17.1 6.9 l1.4 -1.4" />
  </>
));

// Sirkel-prikk — cyster (hul kule med kjerne)
export const CircleDotThinIcon = make("CircleDotThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="2.5" />
  </>
));

// Blomst — labiaplastikk / kvinnelige inngrep (organisk, mykt)
export const FlowerThinIcon = make("FlowerThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="2" />
    <path d="M12 10 C 10 7 10 4 12 3 C 14 4 14 7 12 10" />
    <path d="M12 14 C 10 17 10 20 12 21 C 14 20 14 17 12 14" />
    <path d="M10 12 C 7 10 4 10 3 12 C 4 14 7 14 10 12" />
    <path d="M14 12 C 17 10 20 10 21 12 C 20 14 17 14 14 12" />
  </>
));

// Knytte hender — HeartHandshake (omsorg, plan, oppfølging)
export const HandshakeThinIcon = make("HandshakeThinIcon", () => (
  <>
    <path d="M3 12 L7 8 L12 13 L17 8 L21 12" />
    <path d="M7 14 L10 17 a1.5 1.5 0 0 0 2.1 0 L14 15" />
    <path d="M12 13 L13.5 14.5 a1.5 1.5 0 0 0 2.1 0 L17 13" />
  </>
));

// Solkrone / lys — symptomer/varme (alternativ for menopause i listing)
export const SparkRayThinIcon = make("SparkRayThinIcon", () => (
  <path d="M12 4 L13 10 L19 11 L13 12 L12 18 L11 12 L5 11 L11 10 z" />
));

// Termometer-stripe — feber/symptom (alternativ thinner)
export const TemperatureThinIcon = make("TemperatureThinIcon", () => (
  <>
    <path d="M10 4 a2 2 0 0 1 4 0 v10 a3.5 3.5 0 1 1 -4 0 z" />
    <path d="M12 6 v9" />
  </>
));

// Føtus / graviditet alt — enklere ikon for "Pregnancy" i undertjeneste-rader
// (brukes ikke som default — vi har PregnancyIcon allerede)

// Knapp-pil — for "Les mer" alt
// (allerede dekket av ArrowRightLineIcon)

// Plaster — generelle inngrep / sårbehandling
export const BandageThinIcon = make("BandageThinIcon", () => (
  <>
    <rect x="3" y="9" width="18" height="6" rx="2" transform="rotate(-25 12 12)" />
    <circle cx="10.5" cy="11" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="13.5" cy="13" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="11" cy="13.5" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="13" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
  </>
));

// DNA-helix — fertilitet / genetisk
export const DnaThinIcon = make("DnaThinIcon", () => (
  <>
    <path d="M7 4 C 7 8 17 10 17 14 C 17 18 7 16 7 20" />
    <path d="M17 4 C 17 8 7 10 7 14 C 7 18 17 16 17 20" />
    <path d="M9 7 h6 M9 11 h6 M9 17 h6 M9 13 h6" />
  </>
));

// Egg-celle — IVF / eggdonasjon
export const EggCellThinIcon = make("EggCellThinIcon", () => (
  <>
    <ellipse cx="12" cy="13" rx="6.5" ry="7.5" />
    <circle cx="12" cy="13" r="2" />
  </>
));

// Mannlig / urologi alt — Mars-symbol (for prostata/urologi underrader)
export const MaleSignThinIcon = make("MaleSignThinIcon", () => (
  <>
    <circle cx="10" cy="14" r="5" />
    <path d="M14 10 L20 4 M15 4 h5 v5" />
  </>
));

// Kvinnelig — Venus-symbol (kvinnehelse alt)
export const FemaleSignThinIcon = make("FemaleSignThinIcon", () => (
  <>
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14 v7 M9 18 h6" />
  </>
));

// Pasient-reise / steg — for "Steg 01..04"
export const StepsThinIcon = make("StepsThinIcon", () => (
  <>
    <path d="M3 19 h4 v-4 h4 v-4 h4 v-4 h4" />
    <circle cx="3.5" cy="19" r="0.8" fill="currentColor" stroke="none" />
  </>
));

// Sjekkliste – alt for clipboard (mer minimal)
export const ChecklistThinIcon = make("ChecklistThinIcon", () => (
  <>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 9 l1.2 1.2 L13 7.5" />
    <path d="M14 9 h3" />
    <path d="M9 14 l1.2 1.2 L13 12.5" />
    <path d="M14 14 h3" />
    <path d="M9 19 h8" />
  </>
));

// Stjerne-cirkel — kvalitet
export const StarCircleThinIcon = make("StarCircleThinIcon", () => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5 l1.4 2.8 l3.1 0.4 l-2.3 2.1 l0.6 3.0 l-2.8 -1.5 l-2.8 1.5 l0.6 -3.0 l-2.3 -2.1 l3.1 -0.4 z" />
  </>
));

// Hjerne-puls — nevrologi alt
// (har Brain allerede)

// Sirkel + pil — tilbakestill / fornye
export const RefreshThinIcon = make("RefreshThinIcon", () => (
  <>
    <path d="M4 12 a8 8 0 0 1 14 -5" />
    <path d="M18 4 v4 h-4" />
    <path d="M20 12 a8 8 0 0 1 -14 5" />
    <path d="M6 20 v-4 h4" />
  </>
));

// Hus / hjem (klinikk hjemme)
export const HomeThinIcon = make("HomeThinIcon", () => (
  <>
    <path d="M4 11 L12 4 L20 11 V20 a1 1 0 0 1 -1 1 H5 a1 1 0 0 1 -1 -1 z" />
    <path d="M10 21 v-6 h4 v6" />
  </>
));

/* =========================================================================
 * SYMBOLIC SUBSPECIALITY — symbolske, ikke-brutale, unike per undertjeneste
 * Erstatter Scissors/Droplets/HeartPulse som blir repeterende eller for direkte
 * ========================================================================= */

// Fjerne livmor — symbolsk: en lukket sirkel som "slippes fri" (ikke saks!)
// To halvmåner som skiller seg = avslutning av en livsfase, mykt og verdig
export const HysterectomyIcon = make("HysterectomyIcon", () => (
  <>
    <path d="M7 12 a5 5 0 0 1 5 -5" />
    <path d="M17 12 a5 5 0 0 0 -5 -5" />
    <path d="M9 16 l-2 2 M15 16 l2 2" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </>
));

// Gynekologisk kirurgi — symbolsk: presisjons-sirkel med markør (ikke saks)
export const PrecisionSurgeryIcon = make("PrecisionSurgeryIcon", () => (
  <>
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3 v3 M12 18 v3 M3 12 h3 M18 12 h3" />
  </>
));

// Sirkumsisjon — symbolsk: konsentrisk ring (anatomisk nøytral)
export const CircumcisionIcon = make("CircumcisionIcon", () => (
  <>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" strokeDasharray="2 2" />
  </>
));

// Vaginale fremfall — symbolsk: pil som støtter opp (struktur), ikke hjerte-puls
export const ProlapseSupportIcon = make("ProlapseSupportIcon", () => (
  <>
    <path d="M5 18 h14" />
    <path d="M12 18 v-9" />
    <path d="M9 12 l3 -3 l3 3" />
    <path d="M7 14 l5 -5 l5 5" opacity="0.4" />
  </>
));

// Vulvalidelser — symbolsk: omsorgsskjold med dråpe (mykere enn shield-check)
export const VulvarCareIcon = make("VulvarCareIcon", () => (
  <>
    <path d="M12 3 L19 6 v6 c0 4 -3 7 -7 9 c-4 -2 -7 -5 -7 -9 V6 z" />
    <path d="M12 9 c -1.5 2 -2.5 3.5 -2.5 5 a 2.5 2.5 0 0 0 5 0 c 0 -1.5 -1 -3 -2.5 -5 z" />
  </>
));

// Vaginal tørrhet — symbolsk: balanse / fukt (mer subtilt enn dråpe)
export const HydrationBalanceIcon = make("HydrationBalanceIcon", () => (
  <>
    <path d="M8 5 c -1 2 -2 3.5 -2 5 a 2 2 0 0 0 4 0 c 0 -1.5 -1 -3 -2 -5 z" />
    <path d="M16 14 c -1 2 -2 3.5 -2 5 a 2 2 0 0 0 4 0 c 0 -1.5 -1 -3 -2 -5 z" />
    <path d="M5 19 L19 5" opacity="0.3" />
  </>
));

// Urinlekkasje — symbolsk: kontroll / sirkel med liten dråpe (ikke 3 dråper)
export const ContinenceIcon = make("ContinenceIcon", () => (
  <>
    <circle cx="12" cy="13" r="7" />
    <path d="M12 9 c -1 1.5 -1.5 2.5 -1.5 3.5 a 1.5 1.5 0 0 0 3 0 c 0 -1 -0.5 -2 -1.5 -3.5 z" />
  </>
));

// Endometriose — symbolsk: bånd-sløyfe (mer raffinert enn awareness ribbon)
export const EndometriosisIcon = make("EndometriosisIcon", () => (
  <>
    <path d="M10 4 C 8 8 8 12 11 14" />
    <path d="M14 4 C 16 8 16 12 13 14" />
    <path d="M11 14 L9 20 L12 17 L15 20 L13 14" />
  </>
));

// Cyster — symbolsk: små bobler (kluster, ikke én sirkel-prikk)
export const CystClusterIcon = make("CystClusterIcon", () => (
  <>
    <circle cx="9" cy="10" r="3" />
    <circle cx="15" cy="13" r="2.5" />
    <circle cx="11" cy="16" r="2" />
  </>
));

// Celleforandringer — symbolsk: rutemønster med én avvikende celle
export const CellChangeIcon = make("CellChangeIcon", () => (
  <>
    <circle cx="8" cy="8" r="2" />
    <circle cx="14" cy="8" r="2" />
    <circle cx="8" cy="14" r="2" />
    <circle cx="14" cy="14" r="2.5" strokeWidth="2" />
  </>
));

// Blødningsforstyrrelser — symbolsk: månesyklus (4 faser)
export const CycleIcon = make("CycleIcon", () => (
  <>
    <circle cx="6" cy="12" r="2" />
    <circle cx="11" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.3" />
    <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.6" />
    <circle cx="21" cy="12" r="2" fill="currentColor" stroke="none" />
  </>
));

// Labiaplastikk — symbolsk: sommerfugl-form (mykt, organisk, ikke blomst)
export const ButterflySymbolIcon = make("ButterflySymbolIcon", () => (
  <>
    <path d="M12 8 v10" />
    <path d="M12 9 C 8 6 4 7 4 11 C 4 14 8 15 12 13" />
    <path d="M12 9 C 16 6 20 7 20 11 C 20 14 16 15 12 13" />
  </>
));

// PMS / PMDD — symbolsk: bølge (humør, syklus), ikke hjerte
export const MoodWaveIcon = make("MoodWaveIcon", () => (
  <>
    <path d="M3 14 C 6 9 9 9 12 12 C 15 15 18 15 21 10" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
  </>
));

// Overgangsalder — symbolsk: horisont / soloppgang (livsfase), ikke sol
export const HorizonIcon = make("HorizonIcon", () => (
  <>
    <path d="M3 17 h18" />
    <path d="M5 17 a7 7 0 0 1 14 0" />
    <path d="M12 6 v2 M7 8 l1 1.5 M17 8 l-1 1.5" />
  </>
));

// Prostata — symbolsk: rund form i ramme (anatomisk nøytral)
export const ProstateIcon = make("ProstateIcon", () => (
  <>
    <path d="M7 10 a5 5 0 0 1 10 0 v2 a5 4 0 0 1 -10 0 z" />
    <path d="M11 7 v-2 M13 7 v-2" />
  </>
));

// Erektil dysfunksjon — symbolsk: livsenergi-bølge oppover
export const VitalityIcon = make("VitalityIcon", () => (
  <>
    <path d="M5 18 L9 12 L13 15 L19 6" />
    <path d="M19 11 V6 h-5" />
  </>
));

// Urinveisinfeksjon — symbolsk: skjold med liten markør
export const UrinaryHealthIcon = make("UrinaryHealthIcon", () => (
  <>
    <path d="M12 3 L19 6 v6 c0 4 -3 7 -7 9 c-4 -2 -7 -5 -7 -9 V6 z" />
    <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
    <path d="M12 13 v3" />
  </>
));

// IVF — symbolsk: omsorgshender om celle (varmere enn egg-sirkel)
export const IvfIcon = make("IvfIcon", () => (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M5 17 C 5 13 7 10 12 10" />
    <path d="M19 17 C 19 13 17 10 12 10" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
  </>
));

// IUI / inseminasjon — symbolsk: målrettet bevegelse (ikke sprøyte)
export const InseminationIcon = make("InseminationIcon", () => (
  <>
    <circle cx="16" cy="12" r="4" />
    <path d="M3 12 h7" />
    <path d="M8 9 l3 3 l-3 3" />
  </>
));

// Eggdonasjon — symbolsk: gave-sirkel (donor-konsept)
export const EggDonationIcon = make("EggDonationIcon", () => (
  <>
    <ellipse cx="12" cy="13" rx="5" ry="6" />
    <path d="M9 7 L12 4 L15 7" />
  </>
));

// Sæddonasjon — symbolsk: bevegelses-spiral
export const SpermDonationIcon = make("SpermDonationIcon", () => (
  <>
    <circle cx="8" cy="12" r="3" />
    <path d="M11 12 C 14 9 17 14 20 11" />
  </>
));

// Fertilitetsutredning — symbolsk: forstørrelsesglass over hjerte
export const FertilityAssessmentIcon = make("FertilityAssessmentIcon", () => (
  <>
    <circle cx="10" cy="10" r="5" />
    <path d="M14 14 L19 19" />
    <path d="M10 8 c -1 1 -1.5 2 -1.5 3 a 1.5 1.5 0 0 0 3 0 c 0 -1 -0.5 -2 -1.5 -3 z" />
  </>
));

/* =========================================================================
 * EXTENDED SYMBOLIC SET — for alle gjenværende undertjenester
 * ========================================================================= */

// Tverrfaglig team — flettede sirkler
export const InterdisciplinaryIcon = make("InterdisciplinaryIcon", () => (
  <>
    <circle cx="9" cy="10" r="4" />
    <circle cx="15" cy="10" r="4" />
    <circle cx="12" cy="16" r="4" />
  </>
));

// Hormoner — molekyl-kjede
export const HormonesIcon = make("HormonesIcon", () => (
  <>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="12" r="2.5" />
    <circle cx="12" cy="6" r="2.5" />
    <circle cx="12" cy="18" r="2.5" />
    <path d="M8 12 h8 M12 8 v8" />
  </>
));

// Hysteroskopi — kikkertinngang i sirkel
export const HysteroscopyIcon = make("HysteroscopyIcon", () => (
  <>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
    <path d="M4 12 h2 M18 12 h2" />
  </>
));

// Robotkirurgi (alt) — presisjons-arm
export const RoboticArmIcon = make("RoboticArmIcon", () => (
  <>
    <circle cx="6" cy="6" r="2" />
    <path d="M7.5 7.5 L12 12 L17 9" />
    <circle cx="17" cy="9" r="2" />
    <path d="M17 11 V18" />
    <path d="M14 18 H20" />
  </>
));

// Spontanabort — omsorgs-hjerte med pause-linje (verdig, ikke trist)
export const PregnancyLossIcon = make("PregnancyLossIcon", () => (
  <>
    <path d="M12 19 C 5 14 4 9 8 7 C 10 6 11 7 12 9 C 13 7 14 6 16 7 C 20 9 19 14 12 19 z" />
    <path d="M9 13 h6" strokeWidth="2" />
  </>
));

// Graviditet (alt) — magekontur
export const PregnancyBumpIcon = make("PregnancyBumpIcon", () => (
  <>
    <path d="M9 4 v4 a 5 5 0 0 0 5 5 a 5 5 0 0 1 0 10 H9 V4" />
    <circle cx="13" cy="11" r="0.8" fill="currentColor" stroke="none" />
  </>
));

/* === UROLOGI === */

// Blære — pære-form
export const BladderIcon = make("BladderIcon", () => (
  <>
    <path d="M12 5 v3" />
    <path d="M7 12 a5 6 0 1 0 10 0 a 4 3 0 0 0 -10 0 z" />
  </>
));

// Forhud — ring med åpning
export const ForeskinIcon = make("ForeskinIcon", () => (
  <>
    <circle cx="12" cy="12" r="7" />
    <path d="M9 12 a3 3 0 0 1 6 0" />
  </>
));

// Mannlig infertilitet — Mars med spørsmål
export const MaleInfertilityIcon = make("MaleInfertilityIcon", () => (
  <>
    <circle cx="10" cy="14" r="4" />
    <path d="M13 11 L19 5 M14 5 h5 v5" />
    <path d="M10 13 v0.5 M10 15.5 v0.5" strokeWidth="2" />
  </>
));

// Nyrer — bønneform (par)
export const KidneysIcon = make("KidneysIcon", () => (
  <>
    <path d="M5 8 c -2 2 -2 6 0 8 c 2 1 4 0 4 -3 c 0 -3 -2 -6 -4 -5 z" />
    <path d="M19 8 c 2 2 2 6 0 8 c -2 1 -4 0 -4 -3 c 0 -3 2 -6 4 -5 z" />
  </>
));

// Refertilisering — Mars + bro/sirkel
export const RefertilisationIcon = make("RefertilisationIcon", () => (
  <>
    <circle cx="8" cy="14" r="3" />
    <circle cx="16" cy="14" r="3" />
    <path d="M11 14 h2" />
    <path d="M5 11 a3 3 0 0 1 14 0" />
  </>
));

// Sterilisering — Mars med X / låst
export const SterilisationIcon = make("SterilisationIcon", () => (
  <>
    <circle cx="10" cy="14" r="4" />
    <path d="M13 11 L19 5 M14 5 h5 v5" />
    <path d="M8 12 l4 4 M12 12 l-4 4" strokeWidth="1.5" />
  </>
));

// Testikler — to ovale former
export const TesticlesIcon = make("TesticlesIcon", () => (
  <>
    <ellipse cx="9" cy="14" rx="3" ry="4" />
    <ellipse cx="15" cy="14" rx="3" ry="4" />
    <path d="M12 7 v3" />
  </>
));

/* === FERTILITET === */

// Eggfrys — egg + snøflak
export const EggFreezeIcon = make("EggFreezeIcon", () => (
  <>
    <ellipse cx="12" cy="13" rx="5" ry="6" />
    <path d="M12 10 v6 M9.5 11 l5 4 M14.5 11 l-5 4" strokeWidth="1" />
  </>
));

// Donorbehandling — to sirkler + pil mellom
export const DonorTreatmentIcon = make("DonorTreatmentIcon", () => (
  <>
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="12" r="3" />
    <path d="M9 12 h6" />
    <path d="M13 10 l2 2 l-2 2" />
  </>
));

// Sædanalyse — mikroskop-rute med spermie
export const SpermAnalysisIcon = make("SpermAnalysisIcon", () => (
  <>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="9" cy="11" r="2" />
    <path d="M11 11 C 13 9 16 14 18 11" />
  </>
));

// Fertilitetsteamet — gruppe-sirkler
export const FertilityTeamIcon = make("FertilityTeamIcon", () => (
  <>
    <circle cx="8" cy="9" r="2.5" />
    <circle cx="16" cy="9" r="2.5" />
    <circle cx="12" cy="15" r="2.5" />
    <path d="M5 19 a 3 3 0 0 1 6 0 M13 19 a 3 3 0 0 1 6 0" />
  </>
));

// Assistert befruktning — to celler som møtes
export const AssistedFertilisationIcon = make("AssistedFertilisationIcon", () => (
  <>
    <circle cx="9" cy="12" r="3.5" />
    <circle cx="16" cy="12" r="1.5" />
    <path d="M16 12 C 14 11 13 13 12.5 12" />
  </>
));

/* === ORTOPEDI === */

// Fot og ankel — fotsåle
export const FootIcon = make("FootIcon", () => (
  <>
    <path d="M9 4 c -2 0 -3 2 -3 5 v6 c0 3 2 5 4 5 c 2 0 3 -2 3 -4 v-6 c 0 -4 -1 -6 -4 -6 z" />
    <circle cx="14" cy="6" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="9" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="14" cy="15" r="0.8" fill="currentColor" stroke="none" />
  </>
));

// Hofte — leddkule i hofteskål
export const HipIcon = make("HipIcon", () => (
  <>
    <path d="M5 5 h6 a3 3 0 0 1 3 3 v3 a4 4 0 0 1 -4 4 H7" />
    <circle cx="14" cy="14" r="4" />
    <path d="M14 18 v3" />
  </>
));

// Hånd og albue — vinklet arm
export const ArmIcon = make("ArmIcon", () => (
  <>
    <path d="M4 19 L10 13 L14 17" />
    <circle cx="10" cy="13" r="1.5" />
    <path d="M14 17 L18 13 L20 14" />
    <path d="M18 11 v-2 M20 11 v-2 M16 11 v-2" />
  </>
));

// Kne — bøyd ben
export const KneeIcon = make("KneeIcon", () => (
  <>
    <path d="M9 4 v6" />
    <circle cx="9" cy="11" r="2.5" />
    <path d="M9 13 L15 18 L19 18" />
  </>
));

// Skulder — leddkule øverst
export const ShoulderIcon = make("ShoulderIcon", () => (
  <>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 11 v4 L13 19" />
    <path d="M11 11 H17 L19 14" />
  </>
));

/* === FLERE FAGOMRÅDER === */

// Endokrinologi — molekyl + sky
export const EndocrinologyIcon = make("EndocrinologyIcon", () => (
  <>
    <circle cx="12" cy="9" r="3" />
    <circle cx="7" cy="15" r="2" />
    <circle cx="17" cy="15" r="2" />
    <path d="M10 11 L8 14 M14 11 L16 14" />
  </>
));

// Hudlege — ansiktssilhuett med flekk
export const DermatologyIcon = make("DermatologyIcon", () => (
  <>
    <path d="M7 6 a 5 7 0 0 1 10 0 v8 a 5 5 0 0 1 -10 0 z" />
    <circle cx="14" cy="11" r="1" fill="currentColor" stroke="none" />
    <circle cx="10" cy="9" r="0.6" fill="currentColor" stroke="none" />
  </>
));

// Ernæringsfysiolog — eple
export const NutritionIcon = make("NutritionIcon", () => (
  <>
    <path d="M12 8 c -3 -1 -7 0 -7 5 c 0 5 4 8 7 8 c 3 0 7 -3 7 -8 c 0 -5 -4 -6 -7 -5 z" />
    <path d="M12 8 v-2 a 2 2 0 0 1 2 -2" />
    <path d="M10 5 c 0 1 1 2 2 3" />
  </>
));

// Gastrokirurgi — magesirkel med snitt-markør
export const GastroSurgeryIcon = make("GastroSurgeryIcon", () => (
  <>
    <path d="M8 5 c -2 2 -3 5 -3 8 c 0 4 3 7 7 7 c 4 0 7 -3 7 -7 c 0 -3 -1 -5 -3 -7" />
    <path d="M9 11 h6 M11 8 h2" />
  </>
));

// Osteopati — ryggrad-segmenter
export const OsteopathyIcon = make("OsteopathyIcon", () => (
  <>
    <path d="M12 3 v18" />
    <circle cx="12" cy="6" r="1.5" />
    <circle cx="12" cy="10" r="1.5" />
    <circle cx="12" cy="14" r="1.5" />
    <circle cx="12" cy="18" r="1.5" />
  </>
));

// Plastikkirurgi — ansikt-profil
export const PlasticSurgeryIcon = make("PlasticSurgeryIcon", () => (
  <>
    <path d="M16 4 C 8 4 6 11 8 14 L8 18 a 2 2 0 0 0 2 2 H14 v-3 c2 0 3 -2 3 -4 c 2 -1 1 -3 0 -4 c 0 -3 -1 -5 -1 -5 z" />
    <circle cx="11" cy="11" r="0.6" fill="currentColor" stroke="none" />
  </>
));

// Psykologi — hode med tankekrøll
export const PsychologyIcon = make("PsychologyIcon", () => (
  <>
    <path d="M8 6 a 5 5 0 0 1 10 0 v6 a 3 3 0 0 1 -3 3 H13 v3 H10 v-4 a 5 5 0 0 1 -2 -4 z" />
    <path d="M11 9 c 1 -1 3 0 2 2 c -1 1 -1 2 0 2.5" />
  </>
));

// Revmatologi — leddhånd
export const RheumatologyIcon = make("RheumatologyIcon", () => (
  <>
    <path d="M7 20 V11 a 1 1 0 0 1 2 0 V8 a 1 1 0 0 1 2 0 V7 a 1 1 0 0 1 2 0 V8 a 1 1 0 0 1 2 0 V11 a 4 4 0 0 1 -4 4 H10 a 3 3 0 0 1 -3 -3 z" />
    <circle cx="13" cy="12" r="1" strokeDasharray="1 1" />
  </>
));

// Sexologi — to flettede ringer
export const SexologyIcon = make("SexologyIcon", () => (
  <>
    <circle cx="9" cy="12" r="4" />
    <circle cx="15" cy="12" r="4" />
  </>
));

// Åreknuter — slynget linje
export const VaricoseVeinsIcon = make("VaricoseVeinsIcon", () => (
  <>
    <path d="M9 4 C 13 7 6 11 10 14 C 14 17 8 19 12 21" />
    <path d="M15 4 C 17 8 13 12 16 16 C 18 19 16 20 14 21" opacity="0.5" />
  </>
));

// Hudhelse — sol+hud (ulik fra hudlege)
export const SkinHealthIcon = make("SkinHealthIcon", () => (
  <>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 4 v2 M12 18 v2 M4 12 h2 M18 12 h2 M6.5 6.5 l1.4 1.4 M16.1 16.1 l1.4 1.4 M6.5 17.5 l1.4 -1.4 M16.1 7.9 l1.4 -1.4" opacity="0.5" />
    <circle cx="11" cy="11" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="13" cy="13" r="0.6" fill="currentColor" stroke="none" />
  </>
));

// Overvektskirurgi — kropp med pil ned
export const WeightSurgeryIcon = make("WeightSurgeryIcon", () => (
  <>
    <circle cx="12" cy="6" r="2" />
    <path d="M9 19 V13 a 3 3 0 0 1 6 0 V19" />
    <path d="M18 10 v4 l-2 -2 M18 14 l2 -2" />
  </>
));

/* =========================================================================
 * CLAUDE.AI editorial set ("-cl" suffix)
 * Scandinavian editorial. Symbolic, never brutal. 24×24, stroke 1.5, currentColor.
 * Includes umbrella/category icons (gynekologi, fertilitet, urologi, ortopedi, flere-fagomrader)
 * and pregnancy icons (ultralyd, nipt, svangerskapsteam, fosterdiagnostikk).
 * ========================================================================= */

export const ClGynekologiIcon = make("ClGynekologiIcon", () => (
  <>
    <path d="M12 5c-5 4-5 10 0 14 5-4 5-10 0-14Z"/>
    <circle cx="12" cy="12" r="1.4"/>
  </>
));
export const ClFertilitetIcon = make("ClFertilitetIcon", () => (
  <>
    {/* Variant 3 — Reise: myk buet linje med målpunkt */}
    <path d="M5.5 16 Q9 9.5 12 12 Q15 14.5 17 8.5"/>
    <circle cx="17" cy="8.5" r="1.3" fill="currentColor" stroke="none"/>
  </>
));
export const ClUrologiIcon = make("ClUrologiIcon", () => (
  <>
    <path d="M12 4l-3 5h6Z"/>
    <path d="M7 12c0 4 2 7 5 7s5-3 5-7c0-2-2-3-5-3s-5 1-5 3Z"/>
  </>
));
export const ClOrtopediIcon = make("ClOrtopediIcon", () => (
  <>
    <circle cx="7" cy="7" r="2"/>
    <circle cx="17" cy="17" r="2"/>
    <path d="M8.5 8.5l7 7"/>
  </>
));
export const ClFlereFagomraderIcon = make("ClFlereFagomraderIcon", () => (
  <>
    <circle cx="6" cy="6" r="1.5"/>
    <circle cx="18" cy="6" r="1.5"/>
    <circle cx="6" cy="18" r="1.5"/>
    <circle cx="18" cy="18" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <path d="M7.5 7.5l3 3"/>
    <path d="M16.5 7.5l-3 3"/>
    <path d="M7.5 16.5l3-3"/>
    <path d="M16.5 16.5l-3-3"/>
  </>
));
export const ClUltralydIcon = make("ClUltralydIcon", () => (
  <>
    <path d="M5 19a4 4 0 0 1 4-4"/>
    <path d="M5 19a9 9 0 0 1 9-9"/>
    <path d="M5 19a14 14 0 0 1 14-14"/>
    <circle cx="5" cy="19" r="1" fill="currentColor"/>
  </>
));
export const ClNiptIcon = make("ClNiptIcon", () => (
  <>
    <path d="M12 5c-3 4-5 7-5 9.5 0 2 2 3.5 5 3.5s5-1.5 5-3.5c0-2.5-2-5.5-5-9.5Z"/>
    <path d="M10.5 13l3 2"/>
    <path d="M13.5 13l-3 2"/>
  </>
));
export const ClSvangerskapsteamIcon = make("ClSvangerskapsteamIcon", () => (
  <>
    <path d="M7 19c0-5 2-9 5-9s5 4 5 9"/>
    <circle cx="6" cy="6" r="1.6"/>
    <circle cx="12" cy="5" r="1.6"/>
    <circle cx="18" cy="6" r="1.6"/>
  </>
));
export const ClFosterdiagnostikkIcon = make("ClFosterdiagnostikkIcon", () => (
  <>
    <path d="M4 13h4l1.5-3.5L11 16l1.5-7L14 13h6"/>
  </>
));
export const ClGynekologiskUndersokelseIcon = make("ClGynekologiskUndersokelseIcon", () => (
  <>
    <circle cx="12" cy="12" r="1.4"/>
    <path d="M12 10.5c-1.4-1.6-1.4-4.4 0-6 1.4 1.6 1.4 4.4 0 6Z"/>
    <path d="M13.5 12c1.6-1.4 4.4-1.4 6 0-1.6 1.4-4.4 1.4-6 0Z"/>
    <path d="M12 13.5c1.4 1.6 1.4 4.4 0 6-1.4-1.6-1.4-4.4 0-6Z"/>
    <path d="M10.5 12c-1.6-1.4-4.4-1.4-6 0 1.6 1.4 4.4 1.4 6 0Z"/>
  </>
));
export const ClUrinlekkasjeIcon = make("ClUrinlekkasjeIcon", () => (
  <>
    <path d="M5 11c0 5 4 8 7 8s7-3 7-8"/>
    <path d="M12 6c-1.6 2.5-3 4.5-3 6.2 0 1.6 1.4 2.8 3 2.8s3-1.2 3-2.8c0-1.7-1.4-3.7-3-6.2Z"/>
  </>
));
export const ClEndometrioseIcon = make("ClEndometrioseIcon", () => (
  <>
    <circle cx="12" cy="12" r="7"/>
    <path d="M8 12a4 4 0 0 1 4-4"/>
    <path d="M16 12a4 4 0 0 1-4 4"/>
    <circle cx="12" cy="12" r="1"/>
  </>
));
export const ClOvergangsalderIcon = make("ClOvergangsalderIcon", () => (
  <>
    <circle cx="6" cy="12" r="2.5"/>
    <path d="M12 9.5a2.5 2.5 0 0 1 0 5"/>
    <path d="M18 9.5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 0 0-5Z"/>
  </>
));
export const ClVaginaleFremfallIcon = make("ClVaginaleFremfallIcon", () => (
  <>
    <path d="M5 19v-7a7 7 0 0 1 14 0v7"/>
    <path d="M9 14v5"/>
    <path d="M15 14v5"/>
  </>
));
export const ClBlodningsforstyrrelserIcon = make("ClBlodningsforstyrrelserIcon", () => (
  <>
    <path d="M19 12a7 7 0 1 1-2-4.9"/>
    <path d="M19 5v3.5h-3.5"/>
    <circle cx="9" cy="18" r="1" fill="currentColor"/>
  </>
));
export const ClCelleforandringerIcon = make("ClCelleforandringerIcon", () => (
  <>
    <path d="M12 4 9 5.5v3L12 10l3-1.5v-3Z"/>
    <path d="M8 14l-3 1.5v3L8 20l3-1.5v-3Z"/>
    <path d="M16 14l-3 1.5v3L16 20l3-1.5v-3Z"/>
    <circle cx="16" cy="17" r="1" fill="currentColor"/>
  </>
));
export const ClCysterIcon = make("ClCysterIcon", () => (
  <>
    <circle cx="9" cy="10" r="3"/>
    <circle cx="16" cy="11" r="2"/>
    <circle cx="13" cy="16" r="2.5"/>
  </>
));
export const ClFjerneLivmorIcon = make("ClFjerneLivmorIcon", () => (
  <>
    <path d="M5 13c0 4 3 6 7 6s7-2 7-6"/>
    <path d="M9 11a3 3 0 0 1 6 0"/>
    <path d="M12 5v3"/>
  </>
));
export const ClGraviditetIcon = make("ClGraviditetIcon", () => (
  <>
    <path d="M19 12a7 7 0 1 1-7-7"/>
    <circle cx="12" cy="13" r="2"/>
  </>
));
export const ClGynekologiskKirurgiIcon = make("ClGynekologiskKirurgiIcon", () => (
  <>
    <circle cx="12" cy="12" r="7"/>
    <circle cx="12" cy="12" r="3.5"/>
    <circle cx="12" cy="12" r=".8" fill="currentColor"/>
  </>
));
export const ClHormonforstyrrelserIcon = make("ClHormonforstyrrelserIcon", () => (
  <>
    <path d="M4 10c2-2 4 2 6 0s4 2 6 0 4 2 4 0"/>
    <path d="M4 15c2 2 4-2 6 0s4-2 6 0"/>
  </>
));
export const ClHysteroskopiIcon = make("ClHysteroskopiIcon", () => (
  <>
    <path d="M5 12c2-3 12-3 14 0-2 3-12 3-14 0Z"/>
    <circle cx="12" cy="12" r="1.4"/>
    <path d="M3 12h2"/>
  </>
));
export const ClLabiaplastikkIcon = make("ClLabiaplastikkIcon", () => (
  <>
    <path d="M12 5c-4 3-5 7-3 13 2-2 3-5 3-9"/>
    <path d="M12 5c4 3 5 7 3 13-2-2-3-5-3-9"/>
  </>
));
export const ClRobotkirurgiGynIcon = make("ClRobotkirurgiGynIcon", () => (
  <>
    <path d="M5 8V5h3"/>
    <path d="M19 8V5h-3"/>
    <path d="M5 16v3h3"/>
    <path d="M19 16v3h-3"/>
    <circle cx="12" cy="12" r="2.5"/>
    <circle cx="12" cy="12" r=".8" fill="currentColor"/>
  </>
));
export const ClSpontanabortIcon = make("ClSpontanabortIcon", () => (
  <>
    <path d="M5 14c0 3 3 5 7 5s7-2 7-5"/>
    <path d="M12 5c-2 2-3 5-1 8 2-2 2-5 1-8Z"/>
  </>
));
export const ClVulvalidelserIcon = make("ClVulvalidelserIcon", () => (
  <>
    <path d="M12 5c-4 0-7 2-7 6 0 5 4 8 7 9 3-1 7-4 7-9 0-4-3-6-7-6Z"/>
    <circle cx="12" cy="13" r="1.4"/>
  </>
));
export const ClPmsPmddIcon = make("ClPmsPmddIcon", () => (
  <>
    <circle cx="12" cy="12" r="7"/>
    <path d="M7 13c1.5-1.5 2.5 1.5 4 0s2.5-1.5 4 0 1-1 2-1"/>
  </>
));
export const ClVaginalTorrhetIcon = make("ClVaginalTorrhetIcon", () => (
  <>
    <path d="M12 6c-2 3-3 5-3 7 0 2 1.4 3 3 3s3-1 3-3c0-2-1-4-3-7Z"/>
    <path d="M12 16v3"/>
    <path d="M12 17.5c1 0 2-1 3-2"/>
  </>
));
export const ClTverrfagligTeamIcon = make("ClTverrfagligTeamIcon", () => (
  <>
    <circle cx="9" cy="10" r="4"/>
    <circle cx="15" cy="10" r="4"/>
    <circle cx="12" cy="15" r="4"/>
  </>
));
export const ClInfertilitetIcon = make("ClInfertilitetIcon", () => (
  <>
    <circle cx="11" cy="11" r="5.5"/>
    <path d="M15 15l4 4"/>
    <circle cx="11" cy="11" r="1" fill="currentColor"/>
  </>
));
export const ClAssistertBefruktningIcon = make("ClAssistertBefruktningIcon", () => (
  <>
    <circle cx="12" cy="12" r="1.6"/>
    <path d="M5 12a7 7 0 0 1 7-7"/>
    <path d="M19 12a7 7 0 0 1-7 7"/>
  </>
));
export const ClIvfIcon = make("ClIvfIcon", () => (
  <>
    <path d="M5 12h14"/>
    <path d="M5 12c0 4 3 6 7 6s7-2 7-6"/>
    <circle cx="12" cy="14" r="1.2" fill="currentColor"/>
  </>
));
export const ClEggfrysIcon = make("ClEggfrysIcon", () => (
  <>
    <circle cx="12" cy="12" r="2.5"/>
    <path d="M12 4v5"/>
    <path d="M12 15v5"/>
    <path d="M4 12h5"/>
    <path d="M15 12h5"/>
    <path d="M6.5 6.5l3 3"/>
    <path d="M14.5 14.5l3 3"/>
    <path d="M17.5 6.5l-3 3"/>
    <path d="M9.5 14.5l-3 3"/>
  </>
));
export const ClDonorbehandlingIcon = make("ClDonorbehandlingIcon", () => (
  <>
    <circle cx="12" cy="13" r="6"/>
    <path d="M5 8h14"/>
    <path d="M9 8c0-2 3-2 3 0"/>
    <path d="M15 8c0-2-3-2-3 0"/>
  </>
));
export const ClSaedanalyseIcon = make("ClSaedanalyseIcon", () => (
  <>
    <circle cx="11" cy="11" r="5.5"/>
    <path d="M15 15l4 4"/>
    <circle cx="9" cy="11" r=".6" fill="currentColor"/>
    <circle cx="13" cy="11" r=".6" fill="currentColor"/>
    <circle cx="11" cy="13" r=".6" fill="currentColor"/>
  </>
));
export const ClFertilitetsteametIcon = make("ClFertilitetsteametIcon", () => (
  <>
    <circle cx="6" cy="16" r="2.2"/>
    <circle cx="18" cy="16" r="2.2"/>
    <circle cx="12" cy="6" r="2.2"/>
    <path d="M11 7.8l-3.5 6.4"/>
    <path d="M13 7.8l3.5 6.4"/>
    <path d="M8.2 16h7.6"/>
  </>
));
export const ClInseminasjonIcon = make("ClInseminasjonIcon", () => (
  <>
    <path d="M7 8h10l-4 9h-2Z"/>
    <path d="M12 4v3"/>
    <circle cx="12" cy="6" r=".7" fill="currentColor"/>
  </>
));
export const ClEggdonasjonIcon = make("ClEggdonasjonIcon", () => (
  <>
    <circle cx="12" cy="9" r="3"/>
    <path d="M5 14c0 3 2 5 7 5s7-2 7-5"/>
  </>
));
export const ClSaeddonasjonIcon = make("ClSaeddonasjonIcon", () => (
  <>
    <circle cx="12" cy="6" r="1.4"/>
    <path d="M7 11h10v2c0 2-2 3-5 3s-5-1-5-3v-2Z"/>
    <path d="M12 16v3"/>
    <path d="M9 19h6"/>
  </>
));
export const ClBlaereIcon = make("ClBlaereIcon", () => (
  <>
    <path d="M12 4v3"/>
    <path d="M11 4h2"/>
    <path d="M5 14c0 4 3 6 7 6s7-2 7-6c0-4-3-7-7-7s-7 3-7 7Z"/>
  </>
));
export const ClForhudIcon = make("ClForhudIcon", () => (
  <>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2.5"/>
  </>
));
export const ClMannligInfertilitetIcon = make("ClMannligInfertilitetIcon", () => (
  <>
    <path d="M5 12h4"/>
    <path d="M11 12h2"/>
    <path d="M15 12h4"/>
    <circle cx="5" cy="12" r="1.4"/>
    <circle cx="19" cy="12" r="1.4"/>
  </>
));
export const ClNyrerIcon = make("ClNyrerIcon", () => (
  <>
    <path d="M9 7c-3 1-4 4-3 7s4 4 5 2c0-2 0-4 0-6s-1-4-2-3Z"/>
    <path d="M15 7c3 1 4 4 3 7s-4 4-5 2c0-2 0-4 0-6s1-4 2-3Z"/>
  </>
));
export const ClProstataIcon = make("ClProstataIcon", () => (
  <>
    <path d="M12 4 7 6v6c0 4 2 7 5 8 3-1 5-4 5-8V6Z"/>
    <circle cx="12" cy="12" r="1.4"/>
  </>
));
export const ClRefertiliseringIcon = make("ClRefertiliseringIcon", () => (
  <>
    <path d="M4 14c3 0 5-2 7-2"/>
    <path d="M20 10c-3 0-5 2-7 2"/>
    <path d="M11 12h2"/>
    <circle cx="11" cy="12" r=".8" fill="currentColor"/>
    <circle cx="13" cy="12" r=".8" fill="currentColor"/>
  </>
));
export const ClRobotkirurgiUroIcon = make("ClRobotkirurgiUroIcon", () => (
  <>
    <path d="M4 7V4h3"/>
    <path d="M20 7V4h-3"/>
    <path d="M4 17v3h3"/>
    <path d="M20 17v3h-3"/>
    <circle cx="12" cy="12" r="3"/>
  </>
));
export const ClSteriliseringIcon = make("ClSteriliseringIcon", () => (
  <>
    <path d="M9 9c-2 2-2 4 0 6s4 2 6 0 2-4 0-6-4-2-6 0Z"/>
    <path d="M9.5 9.5l5 5"/>
  </>
));
export const ClTestiklerIcon = make("ClTestiklerIcon", () => (
  <>
    <path d="M6 9c-1 4 0 8 3 9h6c3-1 4-5 3-9-1-2-4-3-6-3s-5 1-6 3Z"/>
    <circle cx="10" cy="13" r="2"/>
    <circle cx="14" cy="13" r="2"/>
  </>
));
export const ClUrinveisinfeksjonIcon = make("ClUrinveisinfeksjonIcon", () => (
  <>
    <path d="M12 7c-2 3-3 5-3 7 0 1.6 1.4 2.8 3 2.8s3-1.2 3-2.8c0-2-1-4-3-7Z"/>
    <path d="M5 12a7 7 0 0 1 3-5.8"/>
    <path d="M19 12a7 7 0 0 1-3 5.8"/>
  </>
));
export const ClErektilDysfunksjonIcon = make("ClErektilDysfunksjonIcon", () => (
  <>
    <path d="M12 19V7"/>
    <path d="M12 12c2 0 4-2 4-4"/>
    <path d="M12 10c-2 0-4-2-4-4"/>
    <path d="M9 19h6"/>
  </>
));
export const ClFotAnkelIcon = make("ClFotAnkelIcon", () => (
  <>
    <path d="M9 4v8a3 3 0 0 0 3 3h7"/>
    <circle cx="9" cy="12" r="1.8"/>
  </>
));
export const ClHofteIcon = make("ClHofteIcon", () => (
  <>
    <path d="M5 12a7 7 0 0 1 7-7"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M14 14v5"/>
  </>
));
export const ClHandAlbueIcon = make("ClHandAlbueIcon", () => (
  <>
    <path d="M5 6v5"/>
    <circle cx="5" cy="11" r="1.6"/>
    <path d="M5.8 12.2L13 17"/>
    <path d="M13 17l3-1 2 1-1 2h-3Z"/>
  </>
));
export const ClKneIcon = make("ClKneIcon", () => (
  <>
    <path d="M19 5l-7 7"/>
    <circle cx="12" cy="12" r="2"/>
    <path d="M12 12l-7 7"/>
  </>
));
export const ClSkulderIcon = make("ClSkulderIcon", () => (
  <>
    <circle cx="6" cy="8" r="2"/>
    <path d="M6 8c3 0 6-2 10-2"/>
    <path d="M6 8v11"/>
  </>
));
export const ClEndokrinologiIcon = make("ClEndokrinologiIcon", () => (
  <>
    <circle cx="12" cy="6" r="2"/>
    <circle cx="7" cy="14" r="2"/>
    <circle cx="17" cy="14" r="2"/>
    <path d="M12 8l-3.5 4"/>
    <path d="M12 8l3.5 4"/>
    <path d="M9 14h6"/>
  </>
));
export const ClHudlegeIcon = make("ClHudlegeIcon", () => (
  <>
    <path d="M4 10c3-2 6 2 9 0s6 2 7 0"/>
    <path d="M4 14c3-2 6 2 9 0s6 2 7 0"/>
  </>
));
export const ClErnaringsfysiologIcon = make("ClErnaringsfysiologIcon", () => (
  <>
    <circle cx="12" cy="14" r="6"/>
    <path d="M12 8c0-2 1-4 3-4"/>
    <path d="M12 8V6"/>
  </>
));
export const ClGastrokirurgiIcon = make("ClGastrokirurgiIcon", () => (
  <>
    <path d="M7 5c0 4 10 4 10 7s-10 3-10 7"/>
    <circle cx="12" cy="12" r=".8" fill="currentColor"/>
  </>
));
export const ClOsteopatiIcon = make("ClOsteopatiIcon", () => (
  <>
    <path d="M12 4v16"/>
    <path d="M10 7h4"/>
    <path d="M10 11h4"/>
    <path d="M10 15h4"/>
    <path d="M10 19h4"/>
  </>
));
export const ClPlastikkirurgiIcon = make("ClPlastikkirurgiIcon", () => (
  <>
    <path d="M9 5c0 3-2 4-2 7s2 3 2 6 0 1.5 0 1.5"/>
    <path d="M14 6c0 2 2 4 2 7s-2 4-2 6"/>
    <path d="M9 12h5"/>
  </>
));
export const ClPsykologiIcon = make("ClPsykologiIcon", () => (
  <>
    <path d="M6 19c0-7 3-13 8-13 3 0 4 3 4 6s-3 4-5 3"/>
    <circle cx="13" cy="11" r="1.2"/>
  </>
));
export const ClRevmatologiIcon = make("ClRevmatologiIcon", () => (
  <>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 4v3"/>
    <path d="M12 17v3"/>
    <path d="M4 12h3"/>
    <path d="M17 12h3"/>
    <path d="M6 6l2 2"/>
    <path d="M16 16l2 2"/>
    <path d="M18 6l-2 2"/>
    <path d="M8 16l-2 2"/>
  </>
));
export const ClSexologiIcon = make("ClSexologiIcon", () => (
  <>
    <circle cx="9" cy="12" r="4"/>
    <circle cx="15" cy="12" r="4"/>
  </>
));
export const ClAreknuterIcon = make("ClAreknuterIcon", () => (
  <>
    <path d="M12 19V5"/>
    <path d="M12 9L8 6"/>
    <path d="M12 12l4-3"/>
    <path d="M12 14L7 12"/>
    <path d="M12 16l5-2"/>
  </>
));
export const ClHudhelseIcon = make("ClHudhelseIcon", () => (
  <>
    <path d="M4 17h16"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 5v2"/>
    <path d="M5 12h2"/>
    <path d="M17 12h2"/>
    <path d="M7 7l1.5 1.5"/>
    <path d="M17 7l-1.5 1.5"/>
  </>
));
export const ClOvervektskirurgiIcon = make("ClOvervektskirurgiIcon", () => (
  <>
    <path d="M12 6v13"/>
    <path d="M9 19h6"/>
    <path d="M5 10h14"/>
    <path d="M3 14l2-4 2 4Z"/>
    <path d="M17 14l2-4 2 4Z"/>
  </>
));
