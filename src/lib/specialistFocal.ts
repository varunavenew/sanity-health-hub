// AUTO-GENERATED focal points for specialist portraits.
// Values come from face detection: the face centre is placed at this
// object-position so heads are never cropped, regardless of crop ratio.

const FOCAL: Record<string, string> = {
  "alenka-bindas": "52% 21%",
  "anamika-choudhury": "50% 34%",
  "andreas-edenberg": "45% 40%",
  "ane-gerda-z-eriksson": "48% 50%",
  "are-haukaen-stodle": "46% 38%",
  "ashi-ahmad": "50% 28%",
  "audun-hoegh-tangerud": "44% 45%",
  "birgir-gudbrandsson": "42% 38%",
  "birgitte-aspenes": "47% 35%",
  "birgitte-mitlid-mork": "42% 30%",
  "bjorn-brennhovd": "47% 43%",
  "bjorn-robstad": "47% 30%",
  "cennet-akdeniz": "48% 23%",
  "einar-andre-brevik": "42% 26%",
  "endre-soreide": "49% 38%",
  "erik-berg": "46% 33%",
  "ersan-krckov": "48% 43%",
  "gilbert-moatshe": "52% 40%",
  "gunnar-dalen": "48% 32%",
  "hannah-russell": "47% 40%",
  "henrik-michelsen-wahl": "46% 46%",
  "ida-waagsbo-bjorntvedt": "46% 38%",
  "ingvild-skarpas-aannerud": "53% 40%",
  "istvan-zoltan-rigo": "50% 33%",
  "jackson-tok": "46% 42%",
  "jan-ragnar-haugstvedt": "54% 38%",
  "jan-roland-lambrecht": "46% 31%",
  "jeanette-follestad": "50% 37%",
  "jonas-rydinge": "50% 42%",
  "jorgen-perminow": "48% 38%",
  "kjersti-brenden": "52% 40%",
  "kjersti-margrete-finsrud": "49% 41%",
  "kristian-marstrand-warholm": "54% 39%",
  "kristian-ophaug": "49% 32%",
  "lars-eldar-myrseth": "45% 51%",
  "lars-fredrik-qvigstad": "51% 34%",
  "line-fusdahl-hulleberg": "48% 39%",
  "line-jacob": "51% 40%",
  "linn-myrtveit-stensrud": "47% 38%",
  "linnea-torsnes": "48% 31%",
  "madeleine-engen": "59% 27%",
  "marc-jacob-strauss": "47% 39%",
  "mari-borge-eskerud": "44% 32%",
  "maria-thompson-clausen": "50% 36%",
  "marian-bale": "50% 39%",
  "marthe-hagen": "57% 35%",
  "mia-kitter": "44% 51%",
  "morten-andersen": "41% 27%",
  "nabeel-yousaf-khan": "48% 35%",
  "nicolai-wessel": "44% 41%",
  "siri-klokstad": "47% 49%",
  "sondre-hassellund": "54% 39%",
  "sonu-lukose": "51% 40%",
  "stig-hegna": "46% 38%",
  "tea-berge": "46% 37%",
  "thomas-fredrik-thaulow": "43% 35%",
  "tom-henry-sundoen": "51% 48%",
  "tonje-westlie": "53% 36%",
  "trond-jorgensen": "50% 24%",
};

const DEFAULT_FOCAL = "50% 30%";

/**
 * Returns an object-position value that keeps the specialist's face in frame.
 * Works with bundled asset URLs (hashed filenames) and plain paths.
 */
export const getPortraitFocal = (src?: string): string => {
  if (!src) return DEFAULT_FOCAL;
  const file = src.split("/").pop() || "";
  for (const key of Object.keys(FOCAL)) {
    if (file.startsWith(key)) return FOCAL[key];
  }
  return DEFAULT_FOCAL;
};
