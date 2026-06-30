type JsonLdObject = Record<string, unknown>;

function jsonLdKey(obj: JsonLdObject, index: number): string {
  const type = obj["@type"];
  const id = obj["@id"] ?? obj.url ?? obj.name;
  if (typeof type === "string") {
    return `jsonld-${type}-${String(id ?? index)}`;
  }
  return `jsonld-${index}`;
}

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((obj, i) => (
        <script
          key={jsonLdKey(obj, i)}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
