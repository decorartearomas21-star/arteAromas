import { describe, expect, it, vi } from "vitest";
import {
  createEmptyProductComment,
  ensureEditableProductComments,
  getDiscountPercent,
  hasProductCommentContent,
  normalizeProduct,
  normalizeProductComment,
  normalizeProducts,
  prepareProductForEditor,
  prepareProductsForStorage,
  sanitizeProductComments,
} from "./product";

vi.mock("./url", () => ({
  sanitizeImageSrc: vi.fn((value, fallback) => {
    if (!value) return fallback;
    return String(value).startsWith("http") || String(value).startsWith("/") ? String(value) : fallback;
  }),
}));

describe("product utils", () => {
  it("parses discount values", () => {
    expect(getDiscountPercent(20)).toBe(20);
    expect(getDiscountPercent("15% OFF")).toBe(15);
    expect(getDiscountPercent(null)).toBe(0);
  });

  it("normalizes comments and detects content", () => {
    expect(normalizeProductComment(null)).toBeNull();
    expect(hasProductCommentContent({ name: " ", phrase: "", image: "" })).toBe(false);
    expect(hasProductCommentContent({ name: "Ana" })).toBe(true);
    expect(normalizeProductComment({ name: " Ana ", phrase: " Boa ", image: "/a.png", showOnHome: true }, 1))
      .toEqual({
        id: expect.any(String),
        name: " Ana ",
        phrase: " Boa ",
        image: "/a.png",
        showOnHome: true,
      });
  });

  it("creates and ensures editable comments", () => {
    expect(createEmptyProductComment()).toMatchObject({
      name: "",
      phrase: "",
      image: "",
      showOnHome: false,
    });

    const editable = ensureEditableProductComments([{ id: "1", name: "A", phrase: "", image: "" }]);
    expect(editable).toHaveLength(2);
    expect(editable[1]).toMatchObject({ name: "", phrase: "", image: "" });
  });

  it("sanitizes comments for storage and editor usage", () => {
    const sanitized = sanitizeProductComments([
      { name: " Ana ", phrase: " Muito bom ", image: "/a.png" },
      { name: "", phrase: "", image: "" },
    ]);

    expect(sanitized).toEqual([
      {
        id: expect.any(String),
        name: "Ana",
        phrase: "Muito bom",
        image: "/a.png",
        showOnHome: false,
      },
    ]);

    const editor = prepareProductForEditor({
      image: "/p.png",
      comments: [{ name: "Ana", phrase: "Ok", image: "/a.png" }],
    });

    expect(editor.imagePreview).toBe("/p.png");
    expect(editor.comments[0]).toMatchObject({ imagePreview: "/a.png" });
  });

  it("prepares products for storage and normalizes products", () => {
    const storage = prepareProductsForStorage([
      {
        id: 1,
        image: "/p.png",
        comments: [{ name: "Ana", phrase: "Ok", image: "/a.png" }],
      },
    ]);

    expect(storage[0].image).toBe("/p.png");
    expect(storage[0].imagePreview).toBeUndefined();
    expect(storage[0].comments).toHaveLength(1);

    const normalized = normalizeProduct({
      id: 10,
      name: "Produto",
      category: "Categoria",
      linha: "Linha",
      description: "Descricao",
      price: "199.9",
      image: "/img.png",
      discount: "25%",
      rating: "4",
      isActive: true,
      comments: [{ name: "Ana", phrase: "Ok", image: "/a.png" }],
    });

    expect(normalized).toMatchObject({
      id: "10",
      name: "Produto",
      category: "Categoria",
      linha: "Linha",
      description: "Descricao",
      price: 199.9,
      image: "/img.png",
      discountPercent: 25,
      rating: 4,
      isActive: true,
    });

    expect(normalizeProducts([normalized, { ...normalized, id: "11", isActive: false }])).toHaveLength(1);
    expect(normalizeProducts(null)).toEqual([]);
    expect(prepareProductsForStorage(null)).toEqual([]);
    expect(prepareProductForEditor(null)).toEqual({
      imagePreview: null,
      comments: [
        expect.objectContaining({ name: "", phrase: "", imagePreview: null }),
      ],
    });
  });
});
