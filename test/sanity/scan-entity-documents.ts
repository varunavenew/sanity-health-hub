#!/usr/bin/env npx tsx
/** Scan treatment + specialist docs for remaining HTML entities in EN i18n fields. */
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import path from "path";
import { PROJECT_ID } from "./config";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const TOKEN = process.env.SANITY_TOKEN?.trim();
const DATASET = (process.env.SANITY_DATASET || "developer").trim() as
  | "developer"
  | "production";

const entityRe = /&#\d+;|&#x[0-9a-f]+;|&(?:quot|apos|hellip|nbsp);/gi;

async function scan(dataset: "developer" | "production") {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: TOKEN,
  });

  for (const docType of ["treatment", "specialist"] as const) {
    const ids = await client.fetch<string[]>(
      `*[_type == $type && !(_id in path("drafts.**"))]._id`,
      { type: docType },
    );
    const bad: string[] = [];
    for (const id of ids) {
      const json = JSON.stringify(await client.fetch(`*[_id == $id][0]`, { id }));
      entityRe.lastIndex = 0;
      if (entityRe.test(json)) bad.push(id);
    }
    console.log(`${dataset} ${docType}: ${bad.length}/${ids.length} with entities`);
    if (bad.length) console.log(" ", bad.slice(0, 10).join(", "));
  }
}

async function main() {
  if (process.env.BOTH === "1") {
    await scan("developer");
    await scan("production");
  } else {
    await scan(DATASET);
  }
}

main().catch(console.error);
