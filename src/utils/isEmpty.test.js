import { describe, expect, it } from "vitest";
import { isEmpty } from "./isEmpty";

describe("isEmpty", () => {
  it("treats nullish and zero values as empty", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(0)).toBe(true);
  });

  it("checks strings, arrays, and objects", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty("ok")).toBe(false);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ value: 1 })).toBe(false);
  });

  it("returns false for other primitive values", () => {
    expect(isEmpty(true)).toBe(false);
    expect(isEmpty(42)).toBe(false);
  });
});
