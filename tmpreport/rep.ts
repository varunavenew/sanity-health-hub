import { treatmentContent } from "@/data/treatmentContent";
import { resolveTreatmentImage } from "@/data/serviceImages";
const byImg: Record<string, string[]> = {};
for (const key of Object.keys(treatmentContent)) {
  const [cat, ...rest] = key.split("/");
  const sub = rest.join("/");
  const img = resolveTreatmentImage(cat, sub, (treatmentContent as any)[key].heroImage) as string;
  (byImg[img] ||= []).push(key);
}
for (const [img, keys] of Object.entries(byImg)) {
  if (keys.length > 1) console.log("DUP", decodeURIComponent(img.split("/").pop()!), "=>", keys.join(", "));
}
