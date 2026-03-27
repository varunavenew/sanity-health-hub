#!/usr/bin/env npx tsx
/**
 * Sanity Migration: Job Listings
 *
 * Uploads the 4 static job listings from src/data/jobListings.ts into Sanity.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-job-listings.ts
 */

import { sanityClient } from "./config";

interface JobListing {
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
}

const jobListings: JobListing[] = [
  {
    id: "job-1",
    title: "Gynekolog",
    department: "gynekologi",
    location: "Oslo Majorstuen",
    employmentType: "fast",
    excerpt:
      "Vi søker en erfaren gynekolog til vår klinikk på Majorstuen i Oslo. Du vil jobbe i et tverrfaglig team med moderne utstyr og gode arbeidsforhold.",
    deadline: "2026-05-01",
    contactName: "HR-avdelingen",
    contactEmail: "jobb@cmedical.no",
    slug: "gynekolog-oslo",
    publishedAt: "2026-03-01",
  },
  {
    id: "job-2",
    title: "Fertilitetssykepleier",
    department: "fertilitet",
    location: "Bekkestua",
    employmentType: "fast",
    excerpt:
      "Er du sykepleier med interesse for fertilitet? Vi ser etter en engasjert sykepleier til vårt fertilitetsteam på Bekkestua.",
    deadline: "2026-04-15",
    contactName: "HR-avdelingen",
    contactEmail: "jobb@cmedical.no",
    slug: "fertilitetssykepleier-bekkestua",
    publishedAt: "2026-02-20",
  },
  {
    id: "job-3",
    title: "Resepsjonist / Administrativ medarbeider",
    department: "administrasjon",
    location: "Moss",
    employmentType: "deltid",
    excerpt:
      "Vi søker en serviceinnstilt resepsjonist til vår klinikk i Moss. Stillingen er deltid (60%) med mulighet for økt stillingsprosent.",
    contactName: "HR-avdelingen",
    contactEmail: "jobb@cmedical.no",
    slug: "resepsjonist-moss",
    publishedAt: "2026-03-10",
  },
  {
    id: "job-4",
    title: "Urolog",
    department: "urologi",
    location: "Oslo Majorstuen",
    employmentType: "fast",
    excerpt:
      "Vi søker en spesialist i urologi til vårt team. Du vil ha tilgang til robotassistert kirurgi og arbeide med et bredt spekter av urologiske tilstander.",
    deadline: "2026-06-01",
    contactName: "HR-avdelingen",
    contactEmail: "jobb@cmedical.no",
    slug: "urolog-oslo",
    publishedAt: "2026-03-05",
  },
];

async function migrate() {
  console.log(`\n🚀 Migrating ${jobListings.length} job listings to Sanity...\n`);

  for (const job of jobListings) {
    const doc: Record<string, any> = {
      _id: `jobListing-${job.slug}`,
      _type: "jobListing",
      title: job.title,
      slug: { _type: "slug", current: job.slug },
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      excerpt: job.excerpt,
      publishedAt: new Date(job.publishedAt).toISOString(),
      contactName: job.contactName,
      contactEmail: job.contactEmail,
      active: true,
    };

    if (job.deadline) {
      doc.deadline = job.deadline;
    }
    if (job.contactPhone) {
      doc.contactPhone = job.contactPhone;
    }
    if (job.applyUrl) {
      doc.applyUrl = job.applyUrl;
    }

    try {
      await sanityClient.createOrReplace(doc);
      console.log(`  ✅ ${job.title} (${job.location})`);
    } catch (err: any) {
      console.error(`  ❌ ${job.title}: ${err.message}`);
    }
  }

  console.log("\n✅ Job listings migration complete!\n");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
