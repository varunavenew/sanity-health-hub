import { useQuery } from "@tanstack/react-query";
import { sanityClient, getImageUrl } from "@/lib/sanityClient";

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
          heroSlides[]{id, label, subtitle, cta, ctaPath, objectPosition, "image": image.asset->url},
          tagline,
          categoryCards[]{id, title, path, "image": image.asset->url},
          valueBadges,
          promoBlocks[]{id, title, description, cta, path, "image": image.asset->url},
          faqs[]{id, question, answer},
          bookingCta{badge, title, subtitle, primaryCta, secondaryCta, trustItems}
        }`
      ),
    staleTime: 5 * 60 * 1000,
  });

// ─── Specialists ─────────────────────────────────────────────────────
export interface SanitySpecialist {
  _id: string;
  name: string;
  title: string;
  expertise: string[];
  image: string;
  category: string;
  slug: string;
  bio?: string;
  education?: string;
  experience?: string;
  languages?: string[];
  clinics?: string[];
}

export const useSpecialists = () =>
  useQuery({
    queryKey: ["sanity", "specialists"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(
        `*[_type == "specialist"] | order(name asc){
          _id, name, title, expertise, category, bio, education, experience, languages, clinics,
          "slug": slug.current,
          "image": image.asset->url
        }`
      );
      return (data || []) as SanitySpecialist[];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useSpecialist = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "specialist", slug],
    queryFn: () =>
      fetchSanity<SanitySpecialist>(
        `*[_type == "specialist" && slug.current == $slug][0]{
          _id, name, title, expertise, category, bio, education, experience, languages, clinics,
          "slug": slug.current,
          "image": image.asset->url
        }`,
        { slug }
      ),
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
          _id, name, rating, text, date
        }`
      );
      return (data || []) as SanityReview[];
    },
    staleTime: 5 * 60 * 1000,
  });

// ─── Treatment Categories ────────────────────────────────────────────
export const useTreatmentCategories = () =>
  useQuery({
    queryKey: ["sanity", "treatmentCategories"],
    queryFn: () =>
      fetchSanity<any[]>(
        `*[_type == "treatmentCategory"] | order(order asc){
          _id, title, "slug": slug.current, description, "heroImage": heroImage.asset->url,
          subtitle, faqs,
          "treatments": *[_type == "treatment" && references(^._id)]{
            _id, title, "slug": slug.current, "heroImage": heroImage.asset->url
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
          _id, title, "slug": slug.current, description, subtitle,
          "heroImage": heroImage.asset->url,
          faqs,
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
          process[]{title, description},
          faqs[]{question, answer}
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
    queryFn: () =>
      fetchSanity<any>(
        `*[_type == "aboutPage"][0]{
          title, subtitle, heroText, "heroImage": heroImage.asset->url,
          sections[]{title, content},
          cta{title, subtitle, primaryCta, secondaryCta, secondaryLink}
        }`
      ),
    staleTime: 5 * 60 * 1000,
  });

// ─── Contact Page ────────────────────────────────────────────────────
export const useContactPage = () =>
  useQuery({
    queryKey: ["sanity", "contactPage"],
    queryFn: () =>
      fetchSanity<any>(
        `*[_type == "contactPage"][0]{
          title, subtitle, "heroImage": heroImage.asset->url,
          helpCards[]{icon, title, description, ctaText, ctaPath},
          formTitle, formSubtitle
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
          title, subtitle, "heroImage": heroImage.asset->url,
          categories[]{
            id, label, path,
            subcategories[]{
              label, path,
              items[]{name, price, duration}
            }
          },
          faqs[]{id, question, answer},
          testimonials[]{name, rating, text, treatment}
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
          title, subtitle, "heroImage": heroImage.asset->url,
          companies[]{name},
          steps[]{num, title, desc},
          benefits[]{title, desc}
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
          title, subtitle,
          faqs[]{id, question, answer}
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
