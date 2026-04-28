import { describe, expect, it, vi } from "vitest";

vi.mock("./banner", () => ({
  getBannerData: vi.fn(),
}));
vi.mock("./texts", () => ({
  getTextsData: vi.fn(),
}));
vi.mock("./products", () => ({
  getProductsData: vi.fn(),
}));

import { getBannerData } from "./banner";
import { getTextsData } from "./texts";
import { getProductsData } from "./products";
import { getHomeData } from "./home";

describe("home action", () => {
  it("normalizes and sorts home data", async () => {
    getBannerData.mockResolvedValue({ title: "Banner" });
    getTextsData.mockResolvedValue({
      items: [
        { title: "A", text: "Texto A" },
        "Frase B",
      ],
    });
    getProductsData.mockResolvedValue([
      {
        id: 2,
        name: "B",
        rating: 1,
        isActive: true,
        comments: [{ name: "Ana", phrase: "Ok", showOnHome: true, image: "/a.png" }],
      },
      {
        id: 1,
        name: "A",
        rating: 1,
        isActive: true,
        comments: [],
      },
      {
        id: 3,
        name: "C",
        rating: 0,
        isActive: false,
      },
    ]);

    const result = await getHomeData();

    expect(result.banner).toEqual({ title: "Banner" });
    expect(result.texts).toEqual([
      { titulo: "A", descricao: "Texto A" },
      { titulo: "", descricao: "Frase B" },
    ]);
    expect(result.products.map((product) => product.id)).toEqual(["1", "2"]);
    expect(result.launches.map((product) => product.id)).toEqual(["1", "2"]);
    expect(result.comments).toEqual([
      expect.objectContaining({ name: "Ana", phrase: "Ok", image: "/a.png", showOnHome: true }),
    ]);
  });

  it("falls back to empty home data on failure", async () => {
    getBannerData.mockRejectedValueOnce(new Error("fail"));
    getTextsData.mockRejectedValueOnce(new Error("fail"));
    getProductsData.mockRejectedValueOnce(new Error("fail"));

    await expect(getHomeData()).resolves.toEqual({
      banner: null,
      texts: [],
      products: [],
      launches: [],
      comments: [],
    });
  });

  it("normalizes alternate text payload shapes", async () => {
    getBannerData.mockResolvedValue(null);
    getTextsData.mockResolvedValue({
      frases: ["A", "B"],
      titulo: "T",
    });
    getProductsData.mockResolvedValue([]);

    const result = await getHomeData();
    expect(result.texts).toEqual([
      { titulo: "T", descricao: "A" },
      { titulo: "T", descricao: "B" },
    ]);
  });
});
