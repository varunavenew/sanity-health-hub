/**
 * Move homepage hero slide `imageRight` values to `mobileImage` and remove
 * `imageRight`, so Studio no longer uses the old 50/50 split-image field.
 */
import { sanityClient as client } from "./config";

const DOC_IDS = ["homepage", "drafts.homepage"];

type ImageValue = {
    _type?: string;
    asset?: { _type?: string; _ref?: string };
    hotspot?: unknown;
    crop?: unknown;
};

type Slide = {
    _key?: string;
    imageRight?: ImageValue;
    mobileImage?: ImageValue;
};

async function migrate() {
    for (const id of DOC_IDS) {
        const doc = await client.getDocument<{ heroBanner?: { slides?: Slide[] } }>(id);
        const slides = doc?.heroBanner?.slides;
        if (!slides?.length) {
            console.log(`${id}: no hero slides`);
            continue;
        }

        let changed = false;
        const nextSlides = slides.map((slide) => {
            if (!slide.imageRight) return slide;
            changed = true;
            const { imageRight, ...rest } = slide;
            return {
                ...rest,
                mobileImage: slide.mobileImage || imageRight,
            };
        });

        if (!changed) {
            console.log(`${id}: already migrated`);
            continue;
        }

        await client.patch(id).set({ heroBanner: { slides: nextSlides } }).commit();
        console.log(`${id}: moved imageRight to mobileImage`);
    }
}

migrate().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
