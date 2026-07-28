import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });

const { POST } = await import("../src/app/api/sanity/groq/route.ts");
const { SERVICES_PAGE_QUERY, HOMEPAGE_QUERY } = await import("../src/lib/queries.ts");

async function test(name: string, query: string) {
  const req = new Request("http://localhost/api/sanity/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, params: { lang: "no" } }),
  });
  const res = await POST(req);
  const body = await res.json();
  console.log(name, "status", res.status, res.ok ? "OK" : body);
}

await test("SERVICES", SERVICES_PAGE_QUERY);
await test("HOMEPAGE", HOMEPAGE_QUERY);
