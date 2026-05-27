import type { ImageRef } from "@/lib/media";
import alenkaBindas from "@/assets/specialists/alenka-bindas.jpg";
import anamikaChoudhury from "@/assets/specialists/anamika-choudhury.jpg";
import andreasEdenberg from "@/assets/specialists/andreas-edenberg.jpg";
import aneGerdaZEriksson from "@/assets/specialists/ane-gerda-z-eriksson.webp";
import areHaukaenStodle from "@/assets/specialists/are-haukaen-stodle.jpg";
import ashiAhmad from "@/assets/specialists/ashi-ahmad.webp";
import audunHoeghTangerud from "@/assets/specialists/audun-hoegh-tangerud.jpg";
import birgirGudbrandsson from "@/assets/specialists/birgir-gudbrandsson.jpg";

/** Rotating static portraits when the booking users API has no photo. */
const BOOKING_CAREGIVER_PLACEHOLDERS: ImageRef[] = [
  alenkaBindas,
  anamikaChoudhury,
  andreasEdenberg,
  aneGerdaZEriksson,
  areHaukaenStodle,
  ashiAhmad,
  audunHoeghTangerud,
  birgirGudbrandsson,
];

export function placeholderImageForCaregiverId(userId: number): ImageRef {
  const index = Math.abs(userId) % BOOKING_CAREGIVER_PLACEHOLDERS.length;
  return BOOKING_CAREGIVER_PLACEHOLDERS[index];
}
