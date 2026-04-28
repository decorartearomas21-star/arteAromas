import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/site-content", () => ({
  getSiteContentDocument: vi.fn(),
  saveSiteContentDocument: vi.fn(),
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { getSiteContentDocument, saveSiteContentDocument } from "@/lib/site-content";
import { revalidatePath } from "next/cache";
import { DEFAULT_PRODUCT_HIGHLIGHTS } from "@/lib/product-highlights";
import { getProductHighlightsData, saveProductHighlights } from "./productHighlights";

describe("product highlights actions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads and normalizes highlights", async () => {
    vi.mocked(getSiteContentDocument).mockResolvedValue({ items: [{ label: "A" }] });
    await expect(getProductHighlightsData()).resolves.toEqual([{ id: expect.any(String), label: "A" }]);

    vi.mocked(getSiteContentDocument).mockRejectedValueOnce(new Error("fail"));
    await expect(getProductHighlightsData()).resolves.toEqual(DEFAULT_PRODUCT_HIGHLIGHTS);
  });

  it("saves highlights with fallback defaults", async () => {
    vi.mocked(saveSiteContentDocument).mockResolvedValue(undefined);

    await expect(saveProductHighlights({ items: [{ label: "Novo" }, { label: "   " }] })).resolves.toEqual({
      success: true,
      data: [{ id: expect.any(String), label: "Novo" }],
    });

    await expect(saveProductHighlights(null)).resolves.toEqual({
      success: true,
      data: DEFAULT_PRODUCT_HIGHLIGHTS,
    });

    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/pdp/[id]", "page");
  });

  it("returns an error when saving fails", async () => {
    vi.mocked(saveSiteContentDocument).mockRejectedValueOnce(new Error("boom"));
    await expect(saveProductHighlights({ items: [{ label: "Novo" }] })).resolves.toMatchObject({
      success: false,
      error: "boom",
    });
  });
});
