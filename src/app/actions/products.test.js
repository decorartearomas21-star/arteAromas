import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/site-content", () => ({
  getSiteContentDocuments: vi.fn(),
  saveSiteContentDocuments: vi.fn(),
  saveSiteContentDocument: vi.fn(),
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { getSiteContentDocuments, saveSiteContentDocuments, saveSiteContentDocument } from "@/lib/site-content";
import { getProductsData, saveProductItem, saveProductsList, getProductById } from "./products";

describe("products actions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads product list", async () => {
    vi.mocked(getSiteContentDocuments).mockResolvedValue([{ id: 1 }]);
    await expect(getProductsData()).resolves.toEqual([{ id: 1 }]);

    vi.mocked(getSiteContentDocuments).mockRejectedValueOnce(new Error("fail"));
    await expect(getProductsData()).resolves.toEqual([]);
  });

  it("saves product list and single product", async () => {
    vi.mocked(saveSiteContentDocuments).mockResolvedValue(undefined);
    vi.mocked(saveSiteContentDocument).mockResolvedValue(undefined);

    await expect(
      saveProductsList([{ id: 1, image: "/a.png", comments: [{ name: "Ana", image: "/x.png" }] }]),
    ).resolves.toMatchObject({
      success: true,
      data: [
        {
          id: 1,
          image: "/a.png",
          comments: [{ name: "Ana", image: "/x.png" }],
        },
      ],
    });

    await expect(saveProductItem({ id: 1, image: "/a.png" })).resolves.toMatchObject({
      success: true,
      data: expect.objectContaining({ id: 1, image: "/a.png" }),
    });

    await expect(saveProductItem({})).resolves.toMatchObject({
      success: false,
      error: "Produto inválido.",
    });

    vi.mocked(saveSiteContentDocuments).mockRejectedValueOnce(new Error("boom"));
    await expect(saveProductsList([{ id: 1 }])).resolves.toMatchObject({
      success: false,
      error: "boom",
    });

    vi.mocked(saveSiteContentDocument).mockRejectedValueOnce(new Error("boom"));
    await expect(saveProductItem({ id: 2 })).resolves.toMatchObject({
      success: false,
      error: "boom",
    });
  });

  it("gets product by id", async () => {
    vi.mocked(getSiteContentDocuments).mockResolvedValue([
      { id: 1, name: "A", price: "10" },
      { id: 2, name: "B", price: "20", isActive: false },
    ]);

    await expect(getProductById(1)).resolves.toMatchObject({ id: "1", name: "A" });

    vi.mocked(getSiteContentDocuments).mockRejectedValueOnce(new Error("fail"));
    await expect(getProductById(1)).resolves.toBeNull();
  });
});
