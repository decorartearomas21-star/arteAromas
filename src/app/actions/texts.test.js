import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/site-content", () => ({
  getSiteContentDocuments: vi.fn(),
  saveSiteContentDocuments: vi.fn(),
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { getSiteContentDocuments, saveSiteContentDocuments } from "@/lib/site-content";
import { revalidatePath } from "next/cache";
import { getTextsData, saveTexts } from "./texts";

describe("texts actions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads and normalizes texts", async () => {
    vi.mocked(getSiteContentDocuments).mockResolvedValue({ items: [{ title: "A", text: "Texto" }] });
    await expect(getTextsData()).resolves.toEqual({
      items: [{ id: expect.any(String), titulo: "A", descricao: "Texto" }],
    });

    vi.mocked(getSiteContentDocuments).mockResolvedValueOnce({
      frases: ["A", "B"],
      titulo: "T",
    });
    await expect(getTextsData()).resolves.toEqual({
      items: [
        { id: expect.any(String), titulo: "T", descricao: "A" },
        { id: expect.any(String), titulo: "T", descricao: "B" },
      ],
    });

    vi.mocked(getSiteContentDocuments).mockResolvedValueOnce({
      "2": { texto: "B" },
      "1": { title: "A" },
    });
    await expect(getTextsData()).resolves.toEqual({
      items: [
        { id: expect.any(String), titulo: "A", descricao: "" },
        { id: expect.any(String), titulo: "", descricao: "B" },
      ],
    });

    vi.mocked(getSiteContentDocuments).mockRejectedValueOnce(new Error("fail"));
    await expect(getTextsData()).resolves.toEqual({ items: [] });
  });

  it("saves normalized texts", async () => {
    vi.mocked(saveSiteContentDocuments).mockResolvedValue(undefined);

    await expect(saveTexts({ frases: ["A", "B"], titulo: "Título" })).resolves.toEqual({
      success: true,
      data: {
        items: [
          { id: expect.any(String), titulo: "Título", descricao: "A" },
          { id: expect.any(String), titulo: "Título", descricao: "B" },
        ],
      },
    });

    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/");
  });

  it("returns an error when saving fails", async () => {
    vi.mocked(saveSiteContentDocuments).mockRejectedValueOnce(new Error("boom"));
    await expect(saveTexts({ items: [] })).resolves.toMatchObject({
      success: false,
      error: "boom",
    });
  });
});
