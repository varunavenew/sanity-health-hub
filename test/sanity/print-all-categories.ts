import { sanityClient } from "./config";

async function run() {
    const categories = await sanityClient.fetch(`*[_type == "treatmentCategory"]{
        _id,
        categoryId,
        "titleNo": title[language == "no"][0].value,
        "titleEn": title[language == "en"][0].value,
        "slugNo": slug[language == "no"][0].value.current,
        "slugEn": slug[language == "en"][0].value.current
    }`);
    console.log("Sanity categories:", JSON.stringify(categories, null, 2));
}
run().catch(console.error);
