export function normalizePersonName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/\b(dr|prof|mr|mrs|ms)\.?/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/-/g, " ")
    .split(/\s+/)
    .map((token) => token.replace(/^x/, ""))
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function personNamesLooselyEqual(a: string, b: string): boolean {
  const aKey = normalizePersonName(a);
  const bKey = normalizePersonName(b);
  if (!aKey || !bKey) return false;
  if (aKey === bKey) return true;

  const aTokens = aKey.split(" ");
  const bTokens = bKey.split(" ");
  if (aTokens.length >= 2 && bTokens.length >= 2) {
    if (aTokens[0] === bTokens[0] && aTokens[aTokens.length - 1] === bTokens[bTokens.length - 1]) {
      return true;
    }
  }
  if (aTokens.length >= 2 && aTokens.every((token) => bTokens.includes(token))) return true;
  if (bTokens.length >= 2 && bTokens.every((token) => aTokens.includes(token))) return true;
  return false;
}
