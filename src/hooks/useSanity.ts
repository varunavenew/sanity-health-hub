import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanityClient";

// Generic fetcher
const fetchSanity = <T>(query: string, params?: Record<string, any>): Promise<T> =>
  sanityClient.fetch(query, params);

// ─── Homepage ────────────────────────────────────────────────────────
export const useHomepage = () =>
  useQuery({
    queryKey: ["sanity", "homepage"],
    queryFn: () =>
      fetchSanity<any>(
        `*[_type == "homepage"][0]{
          title,
          tagline,
          heroBanner{
            slides[]{heading, subheading, ctaText, ctaLink, "image": image.asset->url}
          },
          "serviceCategories": serviceCategories[]->{ _id, title, "slug": slug.current, description, icon, color, "heroImage": heroImage.asset->url },
          valueBadges[]{icon, label},
          promoBlocks[]{title, description, ctaText, ctaLink, "image": image.asset->url},
          seo
        }`
      ),
    staleTime: 5 * 60 * 1000,
  });

// ─── Specialists ─────────────────────────────────────────────────────
export interface SanitySpecialist {
  _id: string;
  name: string;
  role: string;
  title?: string;
  specialties: string[];
  expertise?: string[];
  image: string;
  category: string;
  slug: string;
  shortBio?: string;
  bio?: string;
  education?: string[];
  experience?: string;
  languages?: string[];
  clinics?: string[];
  bookingEnabled?: boolean;
}

export const useSpecialists = () =>
  useQuery({
    queryKey: ["sanity", "specialists"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(
        `*[_type == "specialist"] | order(name asc){
          _id, name, role, specialties, shortBio, education, languages, bookingEnabled,
          "slug": slug.current,
          "image": photo.asset->url,
          "categories": categories[]->{ _id, title, "slug": slug.current }
        }`
      );
      // Map fields for backward compatibility with components
      return (data || []).map((s) => ({
        ...s,
        title: s.role,
        expertise: s.specialties,
        bio: s.shortBio,
      })) as SanitySpecialist[];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useSpecialist = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "specialist", slug],
    queryFn: async () => {
      const data = await fetchSanity<any>(
        `*[_type == "specialist" && slug.current == $slug][0]{
          _id, name, role, specialties, shortBio, education, languages, bookingEnabled,
          "slug": slug.current,
          "image": photo.asset->url,
          "categories": categories[]->{ _id, title, "slug": slug.current }
        }`,
        { slug }
      );
      if (!data) return null;
      return {
        ...data,
        title: data.role,
        expertise: data.specialties,
        bio: data.shortBio,
      } as SanitySpecialist;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

// ─── Google Reviews ──────────────────────────────────────────────────
export interface SanityReview {
  _id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export const useGoogleReviews = () =>
  useQuery({
    queryKey: ["sanity", "googleReviews"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(
        `*[_type == "googleReview"] | order(_createdAt desc){
          _id, author, rating, text, date
        }`
      );
      // Map author -> name for backward compatibility
      return (data || []).map((r) => ({
        ...r,
        name: r.author,
      })) as SanityReview[];
    },
    staleTime: 5 * 60 * 1000,
  });

// ─── Treatment Categories ────────────────────────────────────────────
export const useTreatmentCategories = () =>
  useQuery({
    queryKey: ["sanity", "treatmentCategories"],
    queryFn: () =>
      fetchSanity<any[]>(
        `*[_type == "treatmentCategory"] | order(title asc){
          _id, title, "slug": slug.current, categoryId, description, icon, color,
          "heroImage": heroImage.asset->url,
          stats,
          "treatments": *[_type == "treatment" && references(^._id)]{
            _id, title, "slug": slug.current, description, "heroImage": heroImage.asset->url
          }
        }`
      ),
    staleTime: 5 * 60 * 1000,
  });

export const useTreatmentCategory = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "treatmentCategory", slug],
    queryFn: () =>
      fetchSanity<any>(
        `*[_type == "treatmentCategory" && slug.current == $slug][0]{
          _id, title, "slug": slug.current, categoryId, description, icon, color,
          "heroImage": heroImage.asset->url,
          stats,
          seo,
          "treatments": *[_type == "treatment" && references(^._id)]{
            _id, title, "slug": slug.current, description,
            "heroImage": heroImage.asset->url
          }
        }`,
        { slug }
      ),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

// ─── Treatment (sub-treatment) ───────────────────────────────────────
export const useTreatment = (categorySlug: string, treatmentSlug: string) =>
  useQuery({
    queryKey: ["sanity", "treatment", categorySlug, treatmentSlug],
    queryFn: () =>
      fetchSanity<any>(
        `*[_type == "treatment" && slug.current == $treatmentSlug && category->slug.current == $categorySlug][0]{
          _id, title, subtitle, description, benefits, benefitsTitle,
          "heroImage": heroImage.asset->url,
          "parentCategory": category->title,
          "parentSlug": category->slug.current,
          parentCategoryLabel,
          process[]{title, description},
          faqs[]{question, answer},
          seo
        }`,
        { categorySlug, treatmentSlug }
      ),
    enabled: !!categorySlug && !!treatmentSlug,
    staleTime: 5 * 60 * 1000,
  });

// ─── About Page ──────────────────────────────────────────────────────
export const useAboutPage = () =>
  useQuery({
    queryKey: ["sanity", "aboutPage"],
    queryFn: async () => {
      const data = await fetchSanity<any>(
        `*[_type == "aboutPage"][0]{
          title, subtitle, "heroImage": heroImage.asset->url,
          body,
          values,
          seo
        }`
      );
      if (!data) return null;
      // Convert blockContent body into sections array for backward compat
      const sections = (data.body || [])
        .filter((block: any) => block._type === "block")
        .map((block: any) => ({
          title: "",
          content: (block.children || []).map((c: any) => c.text).join(""),
        }));
      return {
        ...data,
        sections,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

// ─── Contact Page ────────────────────────────────────────────────────
export const useContactPage = () =>
  useQuery({
    queryKey: ["sanity", "contactPage"],
    queryFn: () =>
      fetchSanity<any>(
        `*[_type == "contactPage"][0]{
          title, introText, phone, email,
          "heroImage": heroImage.asset->url,
          address{street, city, zip},
          openingHours[]{days, hours},
          seo
        }`
      ),
    staleTime: 5 * 60 * 1000,
  });

// ─── Pricing Page ────────────────────────────────────────────────────
export const usePricingPage = () =>
  useQuery({
    queryKey: ["sanity", "pricingPage"],
    queryFn: () =>
      fetchSanity<any>(
        `*[_type == "pricingPage"][0]{
          title, introText, insuranceNote,
          "heroImage": heroImage.asset->url,
          priceCategories[]{
            categoryName,
            "categoryRef": category->{ _id, title, "slug": slug.current },
            items[]{name, price, priceLabel, note}
          },
          seo
        }`
      ),
    staleTime: 5 * 60 * 1000,
  });

// ─── Insurance Page ──────────────────────────────────────────────────
export const useInsurancePage = () =>
  useQuery({
    queryKey: ["sanity", "insurancePage"],
    queryFn: () =>
      fetchSanity<any>(
        `*[_type == "insurancePage"][0]{
          title, introText,
          "heroImage": heroImage.asset->url,
          partners,
          steps[]{title, description},
          benefits[]{title, description},
          seo
        }`
      ),
    staleTime: 5 * 60 * 1000,
  });

// ─── Services Page ───────────────────────────────────────────────────
export const useServicesPage = () =>
  useQuery({
    queryKey: ["sanity", "servicesPage"],
    queryFn: () =>
      fetchSanity<any>(
        `*[_type == "servicesPage"][0]{
          title, introText,
          "categories": categories[]->{ _id, title, "slug": slug.current, description, icon, color, "heroImage": heroImage.asset->url },
          seo
        }`
      ),
    staleTime: 5 * 60 * 1000,
  });

// ─── Clinics (from homepage or dedicated type) ───────────────────────
export const useClinics = () =>
  useQuery({
    queryKey: ["sanity", "clinics"],
    queryFn: () =>
      fetchSanity<any[]>(
        `*[_type == "clinic"] | order(label asc){
          _id, "id": slug.current, label, address, phone, hours, services
        }`
      ),
    staleTime: 5 * 60 * 1000,
  });
