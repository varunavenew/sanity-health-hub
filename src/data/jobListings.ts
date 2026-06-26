export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  excerpt: string;
  deadline?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  applyUrl?: string;
  slug: string;
  publishedAt: string;
  body?: unknown[];
}
