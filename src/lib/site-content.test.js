import { describe, expect, it, vi, beforeEach } from "vitest";

const updateOne = vi.fn();
const deleteMany = vi.fn();
const findOne = vi.fn();
const toArray = vi.fn();

const collection = vi.fn(() => ({
  findOne,
  find: vi.fn(() => ({
    sort: vi.fn(() => ({
      toArray,
    })),
  })),
  updateOne,
  deleteMany,
}));

const db = {
  collection,
};

vi.mock("./mongodb", () => ({
  hasMongoConfig: vi.fn(),
  getMongoDb: vi.fn(() => Promise.resolve(db)),
}));

import {
  getSiteContentDocument,
  getSiteContentDocuments,
  saveSiteContentDocument,
  saveSiteContentDocuments,
} from "./site-content";
import { getMongoDb, hasMongoConfig } from "./mongodb";

describe("site content helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hasMongoConfig.mockReturnValue(false);
  });

  it("returns cloned defaults when mongo is not configured", async () => {
    const defaultValue = { items: [{ a: 1 }] };
    const result = await getSiteContentDocument("collection", defaultValue);

    expect(result).toEqual(defaultValue);
    expect(result).not.toBe(defaultValue);
  });

  it("reads legacy and data documents from mongo", async () => {
    hasMongoConfig.mockReturnValue(true);
    findOne.mockResolvedValue({ _id: "main", data: { title: "A" } });
    expect(await getSiteContentDocument("collection", null)).toEqual({ title: "A" });

    findOne.mockResolvedValue({ _id: "main", title: "B", updatedAt: new Date() });
    expect(await getSiteContentDocument("collection", null)).toEqual({ title: "B" });

    findOne.mockRejectedValueOnce(new Error("boom"));
    expect(await getSiteContentDocument("collection", { fallback: true })).toEqual({ fallback: true });
  });

  it("reads document lists and falls back to defaults", async () => {
    hasMongoConfig.mockReturnValue(true);
    toArray.mockResolvedValue([
      { _id: "main", data: [1, 2] },
    ]);

    expect(await getSiteContentDocuments("collection", [])).toEqual([1, 2]);

    toArray.mockResolvedValue([
      { _id: "main", data: [3, 4] },
    ]);
    expect(await getSiteContentDocuments("collection", [])).toEqual([3, 4]);

    toArray.mockResolvedValue([
      { _id: "a", data: { value: 1 } },
      { _id: "b", value: 2 },
    ]);

    expect(await getSiteContentDocuments("collection", [])).toEqual([{ value: 1 }, { value: 2 }]);

    toArray.mockRejectedValueOnce(new Error("boom"));
    expect(await getSiteContentDocuments("collection", [9])).toEqual([9]);
  });

  it("saves single and multiple documents", async () => {
    hasMongoConfig.mockReturnValue(true);

    await saveSiteContentDocument("collection", { title: "A" }, "main");
    expect(updateOne).toHaveBeenCalled();

    await saveSiteContentDocuments("collection", [
      { _id: "a", data: { title: "A" } },
      { _id: "b", data: { title: "B" } },
    ]);

    expect(updateOne).toHaveBeenCalledTimes(3);
    expect(deleteMany).toHaveBeenCalledWith({ _id: { $nin: ["a", "b"] } });
    expect(getMongoDb).toHaveBeenCalled();

    updateOne.mockClear();
    deleteMany.mockClear();
    await expect(saveSiteContentDocuments("collection", [])).resolves.toEqual([]);
    expect(deleteMany).toHaveBeenCalledWith({});
  });

  it("throws when mongo is not configured", async () => {
    hasMongoConfig.mockReturnValue(false);
    await expect(saveSiteContentDocument("collection", { a: 1 })).rejects.toThrow(
      "MONGODB_URI not configured.",
    );
    await expect(saveSiteContentDocuments("collection", [])).rejects.toThrow(
      "MONGODB_URI not configured.",
    );
  });
});
