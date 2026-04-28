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
import { getBannerData, saveBanner } from "./banner";

describe("banner actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads banner data", async () => {
    vi.mocked(getSiteContentDocument).mockResolvedValue({ title: "Banner" });
    await expect(getBannerData()).resolves.toEqual({ title: "Banner" });

    vi.mocked(getSiteContentDocument).mockRejectedValueOnce(new Error("fail"));
    await expect(getBannerData()).resolves.toBeNull();
  });

  it("saves sanitized banner data", async () => {
    const formData = new Map([
      ["title", "  Olá  "],
      ["subTitle", "  Mundo  "],
      ["imageUrl", "/image.png"],
      ["primaryButtonText", ""],
      ["primaryButtonLink", "https://example.com"],
      ["secondaryButtonText", ""],
      ["secondaryButtonLink", "/contato"],
    ]);

    formData.get = formData.get.bind(formData);
    vi.mocked(saveSiteContentDocument).mockResolvedValue(undefined);

    await expect(saveBanner(formData)).resolves.toMatchObject({
      success: true,
      data: {
        title: "  Olá  ",
        subTitle: "  Mundo  ",
        imageUrl: "/image.png",
        primaryButtonText: "Compre Agora",
        primaryButtonLink: "https://example.com/",
        secondaryButtonText: "Ver Coleções",
        secondaryButtonLink: "/contato",
      },
    });

    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/");
  });

  it("returns an error when saving fails", async () => {
    vi.mocked(saveSiteContentDocument).mockRejectedValueOnce(new Error("boom"));
    const formData = new Map();
    formData.get = formData.get.bind(formData);

    await expect(saveBanner(formData)).resolves.toMatchObject({
      success: false,
      error: "boom",
    });
  });
});
