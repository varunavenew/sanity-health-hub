import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanityClient";

// Generic fetcher
const fetchSanity = <T>(query: string, params?: Record<string, any>): Promise<T> =>
  sanityClient.fetch(query, params);

// ─── Homepage ────────────────────────────────────────────────────────
export const useHomepage = () =>
  useQuery({
    queryKey: ["sanity", "homepage"],
    queryFn: async () => {
      const data = await fetchSanity<any>(
        `*[_type == "homepage"][0]{
          title, tagline,
          heroBanner{
            slides[]{heading, subheading, ctaText, ctaLink, "image": image.asset->url}
          },
          "serviceCategories": serviceCategories[]->{ _id, title, "slug": slug.current, description, icon, color, "heroImage": heroImage.asset->url },
          valueBadges[]{icon, label},
          promoBlocks[]{title, description, ctaText, ctaLink, "image": image.asset->url},
          seo
        }`
      );
      if (!data) return null;

      // Transform to match component expectations
      return {
        tagline: data.tagline,
        heroSlides: (data.heroBanner?.slides || []).map((s: any, i: number) => ({
          id: `slide-${i}`,
          label: s.heading || "",
          subtitle: s.subheading || "",
          cta: s.ctaText || "Les mer",
          ctaPath: s.ctaLink || "/",
          image: s.image || "",
          objectPosition: "center 30%",
        })),
        categoryCards: (data.serviceCategories || []).map((c: any) => ({
          id: c.slug,
          title: c.title,
          path: `/${c.slug}`,
          image: c.heroImage || "",
        })),
        valueBadges: (data.valueBadges || []).map((v: any) =>
          typeof v === "string" ? v : v.label
        ),
        promoBlocks: (data.promoBlocks || []).map((p: any, i: number) => ({
          id: `promo-${i}`,
          title: p.title,
          description: p.description,
          cta: p.ctaText || "Les mer",
          path: p.ctaLink || "/",
          image: p.image || "",
        })),
        seo: data.seo,
      };
    },
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
      return (data || []).map((s) => ({
        ...s,
        title: s.role || "",
        expertise: s.specialties || [],
        bio: s.shortBio || "",
        category: s.categories?.[0]?.slug || "",
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
        title: data.role || "",
        expertise: data.specialties || [],
        bio: data.shortBio || "",
        category: data.categories?.[0]?.slug || "",
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
      return (data || []).map((r) => ({
        ...r,
        name: r.author || "",
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
          "treatments": *[_type == "treatment" && references(^._id)] | order(title asc){
            _id, title, "slug": slug.current, description, "heroImage": heroImage.asset->url
          }
        }`
      ),
    staleTime: 5 * 60 * 1000,
  });

export const useTreatmentCategory = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "treatmentCategory", slug],
    queryFn: async () => {
      const data = await fetchSanity<any>(
        `*[_type == "treatmentCategory" && (slug.current == $slug || categoryId == $slug)][0]{
          _id, title, "slug": slug.current, categoryId, description, icon, color,
          "heroImage": heroImage.asset->url,
          stats,
          seo,
          "treatments": *[_type == "treatment" && references(^._id)] | order(title asc){
            _id, title, "slug": slug.current, description, subtitle,
            "heroImage": heroImage.asset->url
          }
        }`,
        { slug }
      );
      if (!data) return null;
      // Transform treatments into services format for CategoryPage compatibility
      return {
        ...data,
        services: (data.treatments || []).map((t: any) => ({
          name: t.title,
          path: `/behandlinger/${data.categoryId || data.slug}/${t.slug}`,
        })),
        faqs: [], // FAQs are on individual treatments, not category level in current schema
      };
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

// ─── Treatment (sub-treatment) ───────────────────────────────────────
export const useTreatment = (categorySlug: string, treatmentSlug: string) =>
  useQuery({
    queryKey: ["sanity", "treatment", categorySlug, treatmentSlug],
    queryFn: () =>
      fetchSanity<any>(
        `*[_type == "treatment" && slug.current == $treatmentSlug && (category->slug.current == $categorySlug || category->categoryId == $categorySlug)][0]{
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
      // Convert blockContent body into sections array for backward compat with About.tsx
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
    queryFn: async () => {
      const data = await fetchSanity<any>(
        `*[_type == "contactPage"][0]{
          title, introText, phone, email,
          "heroImage": heroImage.asset->url,
          address{street, city, zip},
          openingHours[]{days, hours},
          seo
        }`
      );
      if (!data) return null;
      return {
        ...data,
        subtitle: data.introText || "",
      };
    },
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
    queryFn: async () => {
      const data = await fetchSanity<any>(
        `*[_type == "insurancePage"][0]{
          title, introText,
          "heroImage": heroImage.asset->url,
          partners,
          steps[]{title, description},
          benefits[]{title, description},
          seo
        }`
      );
      if (!data) return null;
      return {
        ...data,
        subtitle: data.introText || "",
        // Transform partners string[] to {name} objects for component compat
        companies: (data.partners || []).map((p: string) => ({ name: p })),
        // Map step/benefit fields for component compat
        steps: (data.steps || []).map((s: any, i: number) => ({
          num: String(i + 1),
          title: s.title,
          desc: s.description,
        })),
        benefits: (data.benefits || []).map((b: any) => ({
          title: b.title,
          desc: b.description,
        })),
      };
    },
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
