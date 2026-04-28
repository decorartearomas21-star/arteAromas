import { describe, expect, it } from "vitest";
import {
  DEFAULT_PRODUCT_HIGHLIGHTS,
  ensureEditableProductHighlights,
  normalizeProductHighlight,
  normalizeProductHighlightsPayload,
} from "./product-highlights";

describe("product highlights", () => {
  it("normalizes highlight items from multiple shapes", () => {
    expect(normalizeProductHighlight("  Entrega nacional  ")).toMatchObject({
      label: "Entrega nacional",
    });

    expect(normalizeProductHighlight({ title: "Compra segura" })).toMatchObject({
      label: "Compra segura",
    });

    expect(normalizeProductHighlight({})).toBeNull();
  });

  it("normalizes payloads and falls back to defaults", () => {
    expect(normalizeProductHighlightsPayload([{ label: "A" }, { text: "B" }])).toEqual([
      { id: expect.any(String), label: "A" },
      { id: expect.any(String), label: "B" },
    ]);

    expect(normalizeProductHighlightsPayload({ items: [{ descricao: "C" }] })).toEqual([
      { id: expect.any(String), label: "C" },
    ]);

    expect(normalizeProductHighlightsPayload(null)).toEqual(DEFAULT_PRODUCT_HIGHLIGHTS);
  });

  it("ensures an editable trailing item", () => {
    const items = ensureEditableProductHighlights([{ id: "1", label: "A" }]);
    expect(items).toHaveLength(2);
    expect(items[1]).toMatchObject({ label: "" });
  });
});
