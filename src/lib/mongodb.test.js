import { beforeEach, describe, expect, it, vi } from "vitest";

describe("mongodb helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("reports missing config and throws without uri", async () => {
    const module = await import("./mongodb");

    expect(module.hasMongoConfig()).toBe(false);
    await expect(module.getMongoClient()).rejects.toThrow("MONGODB_URI not configured");
  });

  it("connects and returns the configured db when uri exists", async () => {
    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017");
    vi.stubEnv("MONGODB_DB", "test-db");

    vi.doMock("mongodb", () => ({
      MongoClient: class MongoClientMock {
        constructor(uri) {
          this.uri = uri;
        }

        connect() {
          return Promise.resolve({
            db: (name) => ({ name }),
          });
        }
      },
    }));

    const module = await import("./mongodb");

    expect(module.hasMongoConfig()).toBe(true);
    await expect(module.getMongoClient()).resolves.toEqual({
      db: expect.any(Function),
    });
    await expect(module.getMongoDb()).resolves.toEqual({ name: "test-db" });
  });
});
