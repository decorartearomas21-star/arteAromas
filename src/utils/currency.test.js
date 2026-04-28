import { describe, expect, it } from "vitest";
import { currency } from "./currency";

describe("currency", () => {
  it("formats values with currency prefix by default", () => {
    expect(currency(1234.5)).toBe("R$ 1.234,50");
  });

  it("formats values without currency prefix when requested", () => {
    expect(currency(1234.5, false)).toBe("1.234,50");
  });
});
