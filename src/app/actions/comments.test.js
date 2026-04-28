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
import { getCommentsData, saveCommentsList } from "./comments";

describe("comments actions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns comments array or empty list", async () => {
    vi.mocked(getSiteContentDocument).mockResolvedValue([{ name: "Ana" }]);
    await expect(getCommentsData()).resolves.toEqual([{ name: "Ana" }]);

    vi.mocked(getSiteContentDocument).mockRejectedValueOnce(new Error("fail"));
    await expect(getCommentsData()).resolves.toEqual([]);
  });

  it("sanitizes images before saving", async () => {
    vi.mocked(saveSiteContentDocument).mockResolvedValue(undefined);

    await expect(saveCommentsList([{ name: "Ana", image: "/a.png" }])).resolves.toEqual({
      success: true,
      data: [{ name: "Ana", image: "/a.png" }],
    });

    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/");
  });

  it("returns an error when saving fails", async () => {
    vi.mocked(saveSiteContentDocument).mockRejectedValueOnce(new Error("boom"));

    await expect(saveCommentsList([{ name: "Ana" }])).resolves.toEqual({
      success: false,
      error: "boom",
    });
  });
});
