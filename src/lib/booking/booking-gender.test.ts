import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isValidFodselsnummer,
  metodikaGenderFromFodselsnummer,
  personalNumberDigits,
} from "@/lib/booking/personalNumber";
import { buildWebAccountCreateBody } from "@/lib/booking/webAccountPayload";

describe("metodikaGenderFromFodselsnummer", () => {
  it("maps 10099140793 (9th digit 7) to male", () => {
    assert.equal(isValidFodselsnummer("10099140793"), true);
    assert.equal(personalNumberDigits("10099140793")[8], "7");
    assert.equal(metodikaGenderFromFodselsnummer("10099140793"), "male");
  });

  it("maps a valid even 9th digit to female", () => {
    assert.equal(isValidFodselsnummer("07088740259"), true);
    assert.equal(personalNumberDigits("07088740259")[8], "2");
    assert.equal(metodikaGenderFromFodselsnummer("07088740259"), "female");
  });

  it("maps a valid D-number using the 9th digit of the full number", () => {
    const dNumber = "41010000023";
    assert.equal(isValidFodselsnummer(dNumber), true);
    assert.ok(Number(dNumber.slice(0, 2)) > 40);
    assert.equal(metodikaGenderFromFodselsnummer(dNumber), "female");
  });
});

describe("buildWebAccountCreateBody", () => {
  it("includes Metodika gender string on the upstream payload", () => {
    const body = buildWebAccountCreateBody({
      firstname: "Test",
      lastname: "Person",
      email: "test@example.com",
      mobile: "40617409",
      personalnumber: "10099140793",
    });
    assert.equal(body.gender, "male");
  });
});
