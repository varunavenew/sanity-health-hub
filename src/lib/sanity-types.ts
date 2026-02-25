export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image?: any;
}

export interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

export interface DoctorItem {
  _id: string;
  name: string;
  specialty: string;
  bio: string;
  image?: any;
}

export interface TestimonialItem {
  _id: string;
  name: string;
  quote: string;
  rating: number;
  image?: any;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
}
