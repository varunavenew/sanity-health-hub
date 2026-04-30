/**
 * Centralized icon system for CMedical.
 *
 * RULE (customer directive): Icons are FUNCTIONAL only — never decorative.
 * - Size: 16–24px, alongside text in lists, buttons, FAQ, contact info, categories.
 * - Never use icons as hero/blickfang elements (no 80px+ icons in colored circles).
 * - Storytelling belongs to photo/video, not icons or illustrations.
 *
 * To add a new icon:
 * 1. Import it from lucide-react below.
 * 2. Add it to the ICONS map with a kebab-case key (matches Sanity input).
 * 3. Surface the key in `iconChoices` so editors can pick it in Studio.
 */

import {
  // Health / medical
  HeartPulse, Stethoscope, Microscope, Pill, Syringe, Activity, ShieldCheck,
  // Navigation / UI
  ArrowRight, ArrowLeft, ChevronRight, ChevronDown, Check, X, Plus, Minus, Search, HelpCircle,
  // Contact / location
  Phone, Mail, MapPin, Clock, Calendar, Building2,
  // People / care
  Users, User, UserCheck, Baby, Heart,
  // Info / trust
  Info, Star, Award, FileText, BookOpen, Sparkles,
  // Money / commerce
  Coins, CreditCard, Tag,
  // Misc
  Camera, Video, Play, Lock, Settings, Globe, Mic,
  type LucideIcon,
} from "lucide-react";
import { GynecologyIcon, FertilityIcon, RobotSurgeryIcon } from "./customIcons";

export const ICONS = {
  // health
  "heart-pulse": HeartPulse,
  "stethoscope": Stethoscope,
  "microscope": Microscope,
  "pill": Pill,
  "syringe": Syringe,
  "activity": Activity,
  "shield-check": ShieldCheck,
  // navigation / ui
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  "check": Check,
  "x": X,
  "plus": Plus,
  "minus": Minus,
  "search": Search,
  "help-circle": HelpCircle,
  // contact / location
  "phone": Phone,
  "mail": Mail,
  "map-pin": MapPin,
  "clock": Clock,
  "calendar": Calendar,
  "building": Building2,
  // people
  "users": Users,
  "user": User,
  "user-check": UserCheck,
  "baby": Baby,
  "heart": Heart,
  // info / trust
  "info": Info,
  "star": Star,
  "award": Award,
  "file-text": FileText,
  "book-open": BookOpen,
  "sparkles": Sparkles,
  // money
  "coins": Coins,
  "credit-card": CreditCard,
  "tag": Tag,
  // misc
  "camera": Camera,
  "video": Video,
  "play": Play,
  "lock": Lock,
  "settings": Settings,
  "globe": Globe,
  "mic": Mic,
  // custom CMedical icons (same render API as Lucide)
  "gynecology": GynecologyIcon as unknown as LucideIcon,
  "fertility": FertilityIcon as unknown as LucideIcon,
  "robot-surgery": RobotSurgeryIcon as unknown as LucideIcon,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/**
 * Resolve an icon name (kebab-case or PascalCase) to an icon component
 * (Lucide or custom CMedical). Falls back to HelpCircle if unknown.
 */
export function getIcon(name?: string | null): LucideIcon {
  if (!name) return HelpCircle;
  const key = name
    .replace(/([a-z])([A-Z])/g, "$1-$2") // PascalCase → kebab
    .toLowerCase()
    .trim() as IconName;
  return ICONS[key] ?? HelpCircle;
}

/** Choices for Sanity Studio icon picker (label + value pairs). */
export const iconChoices = (Object.keys(ICONS) as IconName[]).map((key) => ({
  title: key,
  value: key,
}));
