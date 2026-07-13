import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadLiveRelatedMap(): Record<string, string[]> {
    const path = resolve(__dirname, "../../src/data/treatmentContent.ts");
    const src = readFileSync(path, "utf8");
    const keyRe = /"([a-z0-9-]+)\/([a-z0-9-]+)"\s*:\s*\{/g;
    const keys: { key: string; index: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = keyRe.exec(src)) !== null) {
        keys.push({ key: `${m[1]}/${m[2]}`, index: m.index });
    }

    const map: Record<string, string[]> = {};
    for (let i = 0; i < keys.length; i++) {
        const start = keys[i].index;
        const end = keys[i + 1]?.index ?? src.length;
        const chunk = src.slice(start, end);
        const relMatch = chunk.match(/relatedSpecialists\s*:\s*\[([^\]]*)\]/);
        if (!relMatch) continue;
        const slugs = Array.from(relMatch[1].matchAll(/["']([a-z0-9-]+)["']/g)).map((mm) => mm[1]);
        if (slugs.length > 0) map[keys[i].key] = slugs;
    }
    return map;
}

const map = loadLiveRelatedMap();
console.log("fertilitet/donorbehandling entry:", map["fertilitet/donorbehandling"]);
console.log("Keys in map:", Object.keys(map));
