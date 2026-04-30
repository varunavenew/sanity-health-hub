/**
 * Centralized icon system for CMedical.
 *
 * RULE (customer directive): Icons are FUNCTIONAL only — never decorative.
 * - Size: 16–24px, alongside text in lists, buttons, FAQ, contact info, categories.
 * - Never use icons as hero/blickfang elements (no 80px+ icons in colored circles).
 * - Storytelling belongs to photo/video, not icons or illustrations.
 *
 * Two parallel sets are registered:
 *   - Lucide icons (current production)        → keys without suffix (e.g. "phone")
 *   - Custom CMedical icons (proposal)         → keys with "-cm" suffix (e.g. "phone-cm")
 *
 * The /icon-preview page renders them side-by-side so the client can approve
 * the custom set before we swap defaults.
 */

import {
  // Health / medical
  HeartPulse, Stethoscope, Microscope, Pill, Syringe, Activity, ShieldCheck,
  // Navigation / UI
  ArrowRight, ArrowLeft, ArrowUpRight, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Check, CheckCircle, X, Plus, Minus, Search, HelpCircle, Menu, ExternalLink, MoreHorizontal,
  // Contact / location
  Phone, Mail, MapPin, Clock, Calendar, Building2,
  // People / care
  Users, User, UserCheck, UserRound, Baby, Heart, HandHeart,
  // Info / trust
  Info, Star, Award, FileText, FileCheck, BookOpen, Sparkles, Quote, Shield, Scale,
  // Money / commerce
  Coins, CreditCard, Tag, ShoppingBag, Package, Wallet,
  // Misc
  Camera, Video, Play, Lock, Settings, Globe, Mic, Send, MessageCircle, MessageSquare,
  // Medical extra
  Scan, Clipboard, Bone, Brain, Scissors, Thermometer, Smile, Accessibility,
  // Career / locations
  GraduationCap, Briefcase, Train, Car,
  // Misc utility
  Timer, TrendingUp, Zap, Loader2, Circle,
  // Social
  Instagram, Facebook, Linkedin, Youtube, Twitter, Apple, Bot,
  // Subspeciality (Lucide today-equivalents for gynekologi/urologi undertjenester)
  Droplets, Ribbon, Sun, CircleDot, Flower2, HeartHandshake, Home, RefreshCw, ListChecks,
  Footprints, Dna,
  type LucideIcon,
} from "lucide-react";

import {
  // Speciality (no Lucide equivalent)
  GynecologyIcon, FertilityIcon, RobotSurgeryIcon, UrologyIcon, PregnancyIcon,
  MenopauseIcon, UltrasoundIcon, ConsultationIcon, GpDoctorIcon, InsuranceShieldIcon,
  PrivateClinicIcon, TreatmentPlanIcon, BeforeAfterIcon, ConfidentialIcon,
  // Navigation / UI custom
  ArrowRightLineIcon, ArrowLeftLineIcon, ArrowUpRightLineIcon,
  ChevronRightThinIcon, ChevronLeftThinIcon, ChevronDownThinIcon, ChevronUpThinIcon,
  PlusThinIcon, MinusThinIcon, CheckThinIcon, CheckCircleThinIcon, CloseThinIcon,
  SearchThinIcon, MenuThinIcon, ExternalLinkThinIcon, MoreHorizontalThinIcon,
  // Contact custom
  PhoneThinIcon, MailThinIcon, MapPinThinIcon, ClockThinIcon, CalendarThinIcon, BuildingThinIcon,
  // People custom
  UserThinIcon, UsersThinIcon, UserCheckThinIcon, BabyThinIcon, HeartThinIcon, HandHeartThinIcon,
  // Info / trust custom
  InfoThinIcon, StarThinIcon, AwardThinIcon, ShieldThinIcon, ShieldCheckThinIcon,
  FileTextThinIcon, FileCheckThinIcon, BookOpenThinIcon, SparklesThinIcon, QuoteThinIcon, ScaleThinIcon,
  // Commerce custom
  CoinsThinIcon, CreditCardThinIcon, TagThinIcon, ShoppingBagThinIcon, PackageThinIcon, WalletThinIcon,
  // Misc / media custom
  CameraThinIcon, VideoThinIcon, PlayThinIcon, LockThinIcon, SettingsThinIcon, GlobeThinIcon,
  MicThinIcon, SendThinIcon, MessageThinIcon,
  // Medical custom
  StethoscopeThinIcon, HeartPulseThinIcon, SyringeThinIcon, PillThinIcon, ActivityThinIcon,
  MicroscopeThinIcon, ScanThinIcon, ClipboardThinIcon, BoneThinIcon, BrainThinIcon,
  ScissorsThinIcon, ThermometerThinIcon, SmileThinIcon, AccessibilityThinIcon,
  // Career / locations custom
  GraduationCapThinIcon, BriefcaseThinIcon, TrainThinIcon, CarThinIcon,
  // Utility custom
  TimerThinIcon, TrendingUpThinIcon, ZapThinIcon, LoaderThinIcon, HelpCircleThinIcon,
  CircleThinIcon, DotThinIcon,
  // Social custom
  InstagramThinIcon, FacebookThinIcon, LinkedinThinIcon, YoutubeThinIcon, TwitterThinIcon,
  AppleThinIcon, BotThinIcon,
  // Subspeciality custom (gynekologi/urologi/fertilitet undertjenester)
  DropletThinIcon, RibbonThinIcon, SunThinIcon, CircleDotThinIcon, FlowerThinIcon,
  HandshakeThinIcon, SparkRayThinIcon, TemperatureThinIcon, BandageThinIcon,
  DnaThinIcon, EggCellThinIcon, MaleSignThinIcon, FemaleSignThinIcon,
  StepsThinIcon, ChecklistThinIcon, StarCircleThinIcon, RefreshThinIcon, HomeThinIcon,
  // Symbolic subspeciality (unique, non-brutal — replaces repeated Scissors/Droplets etc.)
  HysterectomyIcon, PrecisionSurgeryIcon, CircumcisionIcon, ProlapseSupportIcon,
  VulvarCareIcon, HydrationBalanceIcon, ContinenceIcon, EndometriosisIcon,
  CystClusterIcon, CellChangeIcon, CycleIcon, ButterflySymbolIcon, MoodWaveIcon,
  HorizonIcon, ProstateIcon, VitalityIcon, UrinaryHealthIcon,
  IvfIcon, InseminationIcon, EggDonationIcon, SpermDonationIcon, FertilityAssessmentIcon,
} from "./customIcons";

// Cast helper for custom icons (LucideProps-compatible API)
const c = (Icon: unknown) => Icon as unknown as LucideIcon;

export const ICONS = {
  // ===== Lucide (current production set) =====
  // health
  "heart-pulse": HeartPulse,
  "stethoscope": Stethoscope,
  "microscope": Microscope,
  "pill": Pill,
  "syringe": Syringe,
  "activity": Activity,
  "shield-check": ShieldCheck,
  "shield": Shield,
  "scan": Scan,
  "clipboard": Clipboard,
  "bone": Bone,
  "brain": Brain,
  "scissors": Scissors,
  "thermometer": Thermometer,
  "smile": Smile,
  "accessibility": Accessibility,
  // navigation / ui
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "arrow-up-right": ArrowUpRight,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  "check": Check,
  "check-circle": CheckCircle,
  "x": X,
  "plus": Plus,
  "minus": Minus,
  "search": Search,
  "help-circle": HelpCircle,
  "menu": Menu,
  "external-link": ExternalLink,
  "more-horizontal": MoreHorizontal,
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
  "user-round": UserRound,
  "baby": Baby,
  "heart": Heart,
  "hand-heart": HandHeart,
  // info / trust
  "info": Info,
  "star": Star,
  "award": Award,
  "file-text": FileText,
  "file-check": FileCheck,
  "book-open": BookOpen,
  "sparkles": Sparkles,
  "quote": Quote,
  "scale": Scale,
  // money
  "coins": Coins,
  "credit-card": CreditCard,
  "tag": Tag,
  "shopping-bag": ShoppingBag,
  "package": Package,
  "wallet": Wallet,
  // misc
  "camera": Camera,
  "video": Video,
  "play": Play,
  "lock": Lock,
  "settings": Settings,
  "globe": Globe,
  "mic": Mic,
  "send": Send,
  "message-circle": MessageCircle,
  "message-square": MessageSquare,
  // career / locations
  "graduation-cap": GraduationCap,
  "briefcase": Briefcase,
  "train": Train,
  "car": Car,
  // utility
  "timer": Timer,
  "trending-up": TrendingUp,
  "zap": Zap,
  "loader": Loader2,
  "circle": Circle,
  // social
  "instagram": Instagram,
  "facebook": Facebook,
  "linkedin": Linkedin,
  "youtube": Youtube,
  "twitter": Twitter,
  "apple": Apple,
  "bot": Bot,

  // ===== Custom CMedical icons (proposal — "-cm" suffix) =====
  // speciality (no Lucide equivalent)
  "gynecology": c(GynecologyIcon),
  "fertility": c(FertilityIcon),
  "robot-surgery": c(RobotSurgeryIcon),
  "urology": c(UrologyIcon),
  "pregnancy": c(PregnancyIcon),
  "menopause": c(MenopauseIcon),
  "ultrasound": c(UltrasoundIcon),
  "consultation": c(ConsultationIcon),
  "gp-doctor": c(GpDoctorIcon),
  "insurance-shield": c(InsuranceShieldIcon),
  "private-clinic": c(PrivateClinicIcon),
  "treatment-plan": c(TreatmentPlanIcon),
  "before-after": c(BeforeAfterIcon),
  "confidential": c(ConfidentialIcon),
  // medical custom variants
  "heart-pulse-cm": c(HeartPulseThinIcon),
  "stethoscope-cm": c(StethoscopeThinIcon),
  "microscope-cm": c(MicroscopeThinIcon),
  "pill-cm": c(PillThinIcon),
  "syringe-cm": c(SyringeThinIcon),
  "activity-cm": c(ActivityThinIcon),
  "shield-check-cm": c(ShieldCheckThinIcon),
  "shield-cm": c(ShieldThinIcon),
  "scan-cm": c(ScanThinIcon),
  "clipboard-cm": c(ClipboardThinIcon),
  "bone-cm": c(BoneThinIcon),
  "brain-cm": c(BrainThinIcon),
  "scissors-cm": c(ScissorsThinIcon),
  "thermometer-cm": c(ThermometerThinIcon),
  "smile-cm": c(SmileThinIcon),
  "accessibility-cm": c(AccessibilityThinIcon),
  // navigation custom
  "arrow-right-cm": c(ArrowRightLineIcon),
  "arrow-left-cm": c(ArrowLeftLineIcon),
  "arrow-up-right-cm": c(ArrowUpRightLineIcon),
  "chevron-right-cm": c(ChevronRightThinIcon),
  "chevron-left-cm": c(ChevronLeftThinIcon),
  "chevron-down-cm": c(ChevronDownThinIcon),
  "chevron-up-cm": c(ChevronUpThinIcon),
  "plus-cm": c(PlusThinIcon),
  "minus-cm": c(MinusThinIcon),
  "check-cm": c(CheckThinIcon),
  "check-circle-cm": c(CheckCircleThinIcon),
  "x-cm": c(CloseThinIcon),
  "search-cm": c(SearchThinIcon),
  "help-circle-cm": c(HelpCircleThinIcon),
  "menu-cm": c(MenuThinIcon),
  "external-link-cm": c(ExternalLinkThinIcon),
  "more-horizontal-cm": c(MoreHorizontalThinIcon),
  // contact custom
  "phone-cm": c(PhoneThinIcon),
  "mail-cm": c(MailThinIcon),
  "map-pin-cm": c(MapPinThinIcon),
  "clock-cm": c(ClockThinIcon),
  "calendar-cm": c(CalendarThinIcon),
  "building-cm": c(BuildingThinIcon),
  // people custom
  "user-cm": c(UserThinIcon),
  "users-cm": c(UsersThinIcon),
  "user-check-cm": c(UserCheckThinIcon),
  "baby-cm": c(BabyThinIcon),
  "heart-cm": c(HeartThinIcon),
  "hand-heart-cm": c(HandHeartThinIcon),
  // info / trust custom
  "info-cm": c(InfoThinIcon),
  "star-cm": c(StarThinIcon),
  "award-cm": c(AwardThinIcon),
  "file-text-cm": c(FileTextThinIcon),
  "file-check-cm": c(FileCheckThinIcon),
  "book-open-cm": c(BookOpenThinIcon),
  "sparkles-cm": c(SparklesThinIcon),
  "quote-cm": c(QuoteThinIcon),
  "scale-cm": c(ScaleThinIcon),
  // commerce custom
  "coins-cm": c(CoinsThinIcon),
  "credit-card-cm": c(CreditCardThinIcon),
  "tag-cm": c(TagThinIcon),
  "shopping-bag-cm": c(ShoppingBagThinIcon),
  "package-cm": c(PackageThinIcon),
  "wallet-cm": c(WalletThinIcon),
  // media custom
  "camera-cm": c(CameraThinIcon),
  "video-cm": c(VideoThinIcon),
  "play-cm": c(PlayThinIcon),
  "lock-cm": c(LockThinIcon),
  "settings-cm": c(SettingsThinIcon),
  "globe-cm": c(GlobeThinIcon),
  "mic-cm": c(MicThinIcon),
  "send-cm": c(SendThinIcon),
  "message-cm": c(MessageThinIcon),
  // career custom
  "graduation-cap-cm": c(GraduationCapThinIcon),
  "briefcase-cm": c(BriefcaseThinIcon),
  "train-cm": c(TrainThinIcon),
  "car-cm": c(CarThinIcon),
  // utility custom
  "timer-cm": c(TimerThinIcon),
  "trending-up-cm": c(TrendingUpThinIcon),
  "zap-cm": c(ZapThinIcon),
  "loader-cm": c(LoaderThinIcon),
  "circle-cm": c(CircleThinIcon),
  "dot-cm": c(DotThinIcon),
  // social custom
  "instagram-cm": c(InstagramThinIcon),
  "facebook-cm": c(FacebookThinIcon),
  "linkedin-cm": c(LinkedinThinIcon),
  "youtube-cm": c(YoutubeThinIcon),
  "twitter-cm": c(TwitterThinIcon),
  "apple-cm": c(AppleThinIcon),
  "bot-cm": c(BotThinIcon),

  // ===== Subspeciality — Lucide today =====
  "droplets": Droplets,
  "ribbon": Ribbon,
  "sun": Sun,
  "circle-dot": CircleDot,
  "flower": Flower2,
  "heart-handshake": HeartHandshake,
  "home": Home,
  "refresh": RefreshCw,
  "list-checks": ListChecks,
  "footprints": Footprints,
  "dna": Dna,

  // ===== Subspeciality — CMedical custom =====
  "droplet-cm": c(DropletThinIcon),
  "ribbon-cm": c(RibbonThinIcon),
  "sun-cm": c(SunThinIcon),
  "circle-dot-cm": c(CircleDotThinIcon),
  "flower-cm": c(FlowerThinIcon),
  "handshake-cm": c(HandshakeThinIcon),
  "spark-ray-cm": c(SparkRayThinIcon),
  "temperature-cm": c(TemperatureThinIcon),
  "bandage-cm": c(BandageThinIcon),
  "dna-cm": c(DnaThinIcon),
  "egg-cell-cm": c(EggCellThinIcon),
  "male-sign-cm": c(MaleSignThinIcon),
  "female-sign-cm": c(FemaleSignThinIcon),
  "steps-cm": c(StepsThinIcon),
  "checklist-cm": c(ChecklistThinIcon),
  "star-circle-cm": c(StarCircleThinIcon),
  "refresh-cm": c(RefreshThinIcon),
  "home-cm": c(HomeThinIcon),
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/**
 * Resolve an icon name (kebab-case or PascalCase) to an icon component.
 * Falls back to HelpCircle if name is unknown — never throws.
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
