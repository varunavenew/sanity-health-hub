import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanity";
import type {
  HeroContent,
  ServiceItem,
  DoctorItem,
  TestimonialItem,
  SiteSettings,
} from "@/lib/sanity-types";

// Fallback data when Sanity isn't configured
const fallbackHero: HeroContent = {
  title: "Your Health, Our Priority",
  subtitle:
    "Comprehensive healthcare with compassion. Our team of expert physicians provides personalized care using the latest medical advances.",
  ctaText: "Book Appointment",
  ctaLink: "#contact",
};

const fallbackServices: ServiceItem[] = [
  { _id: "1", title: "General Medicine", description: "Comprehensive primary care for patients of all ages, including preventive screenings and chronic disease management.", icon: "Stethoscope" },
  { _id: "2", title: "Cardiology", description: "Advanced heart care with diagnostic testing, interventional procedures, and ongoing cardiac health management.", icon: "Heart" },
  { _id: "3", title: "Pediatrics", description: "Specialized medical care for infants, children, and adolescents in a friendly, comfortable environment.", icon: "Baby" },
  { _id: "4", title: "Orthopedics", description: "Expert care for bones, joints, and muscles — from sports injuries to joint replacement surgery.", icon: "Bone" },
  { _id: "5", title: "Dermatology", description: "Complete skin care including medical dermatology, cosmetic procedures, and skin cancer screening.", icon: "Sparkles" },
  { _id: "6", title: "Neurology", description: "Diagnosis and treatment of disorders affecting the brain, spinal cord, and nervous system.", icon: "Brain" },
];

const fallbackDoctors: DoctorItem[] = [
  { _id: "1", name: "Dr. Sarah Mitchell", specialty: "General Medicine", bio: "20+ years of experience in primary care and preventive medicine." },
  { _id: "2", name: "Dr. James Chen", specialty: "Cardiology", bio: "Board-certified cardiologist specializing in interventional procedures." },
  { _id: "3", name: "Dr. Amara Okafor", specialty: "Pediatrics", bio: "Passionate about children's health with a focus on developmental care." },
  { _id: "4", name: "Dr. Robert Kim", specialty: "Orthopedics", bio: "Sports medicine expert and joint replacement specialist." },
];

const fallbackTestimonials: TestimonialItem[] = [
  { _id: "1", name: "Maria Garcia", quote: "The team at MedCare made me feel completely at ease. Dr. Mitchell took the time to listen and explain everything thoroughly.", rating: 5 },
  { _id: "2", name: "David Thompson", quote: "After my cardiac procedure with Dr. Chen, I feel like a new person. The follow-up care has been exceptional.", rating: 5 },
  { _id: "3", name: "Lisa Nakamura", quote: "My kids actually look forward to their check-ups now. Dr. Okafor is wonderful with children.", rating: 5 },
];

const fallbackSettings: SiteSettings = {
  siteName: "MedCare",
  tagline: "Excellence in Healthcare",
  phone: "(555) 123-4567",
  email: "info@medcare.com",
  address: "123 Medical Center Drive, Suite 100, Health City, HC 12345",
};

function useSanityQuery<T>(key: string, query: string, fallback: T) {
  return useQuery<T>({
    queryKey: [key],
    queryFn: async () => {
      try {
        const data = await sanityClient.fetch(query);
        return data && (Array.isArray(data) ? data.length > 0 : true) ? data : fallback;
      } catch {
        return fallback;
      }
    },
    staleTime: 1000 * 60 * 5,
    initialData: fallback,
  });
}

export function useHero() {
  return useSanityQuery<HeroContent>("hero", `*[_type == "hero"][0]{ title, subtitle, ctaText, ctaLink, image }`, fallbackHero);
}

export function useServices() {
  return useSanityQuery<ServiceItem[]>("services", `*[_type == "service"] | order(order asc){ _id, title, description, icon }`, fallbackServices);
}

export function useDoctors() {
  return useSanityQuery<DoctorItem[]>("doctors", `*[_type == "doctor"] | order(order asc){ _id, name, specialty, bio, image }`, fallbackDoctors);
}

export function useTestimonials() {
  return useSanityQuery<TestimonialItem[]>("testimonials", `*[_type == "testimonial"]{ _id, name, quote, rating, image }`, fallbackTestimonials);
}

export function useSettings() {
  return useSanityQuery<SiteSettings>("settings", `*[_type == "siteSettings"][0]{ siteName, tagline, phone, email, address }`, fallbackSettings);
}
