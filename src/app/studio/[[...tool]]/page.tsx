"use client";

import type { Config } from "sanity";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config as unknown as Config} />;
}
