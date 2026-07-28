import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });

const { buildHomeMetadata } = await import("../src/lib/seo/route-metadata.ts");
const meta = await buildHomeMetadata("en");
console.log("buildHomeMetadata OK", JSON.stringify(meta.title));
