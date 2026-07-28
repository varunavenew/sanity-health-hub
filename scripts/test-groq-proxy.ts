import { config as loadEnv } from "dotenv";
import path from "path";
import { SERVICES_PAGE_QUERY } from "../src/lib/queries";

loadEnv({ path: path.join(process.cwd(), ".env.local") });

const res = await fetch("http://localhost:3000/api/sanity/groq", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: SERVICES_PAGE_QUERY, params: { lang: "no" } }),
});
const text = await res.text();
console.log("status", res.status);
if (res.ok) {
  const body = JSON.parse(text);
  console.log("title", body.data?.title);
  console.log("faqs", body.data?.faqCollection?.questions?.length ?? body.data?.faqs?.length);
} else {
  console.log("body", text.slice(0, 300));
}
