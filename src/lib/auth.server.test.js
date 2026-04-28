import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";

vi.mock("@/lib/site-content", () => ({
  getSiteContentDocument: vi.fn(),
}));

import {
  authenticateFixedUserFromMongo,
  createPasswordHash,
  createSessionCookieValue,
  getLoginUserFromMongo,
  verifySessionCookieServer,
} from "./auth.server";
import { getSiteContentDocument } from "@/lib/site-content";

describe("auth.server", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.AUTH_PASSWORD_PEPPER;
    delete process.env.COOKIE_SECRET;
  });

  it("creates and verifies session cookies", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
    const cookieValue = createSessionCookieValue("user-1", "secret");

    expect(cookieValue).toMatch(/^user-1\.1700000000000\.[^.]+\.[a-f0-9]+$/);
    expect(verifySessionCookieServer(cookieValue, "secret")).toBe(true);
    expect(verifySessionCookieServer(cookieValue, "")).toBe(false);
  });

  it("looks up the login user from mongo", async () => {
    getSiteContentDocument.mockResolvedValue({ id: "x" });
    await expect(getLoginUserFromMongo()).resolves.toEqual({ ok: true, data: { id: "x" } });

    getSiteContentDocument.mockResolvedValueOnce(null);
    await expect(getLoginUserFromMongo()).resolves.toMatchObject({
      ok: false,
      error: expect.stringContaining("not found"),
    });

    getSiteContentDocument.mockRejectedValueOnce(new Error("boom"));
    await expect(getLoginUserFromMongo()).resolves.toMatchObject({ ok: false });
  });

  it("authenticates a fixed user and returns errors for invalid credentials", async () => {
    const passwordHash = createHash("sha256").update("secret").digest("hex");
    getSiteContentDocument.mockResolvedValue({
      id: "decorador-admin",
      email: "admin@example.com",
      passwordHash,
    });

    await expect(
      authenticateFixedUserFromMongo({ email: "admin@example.com", password: "secret" }),
    ).resolves.toMatchObject({
      success: true,
      user: { id: "decorador-admin", email: "admin@example.com" },
    });

    await expect(
      authenticateFixedUserFromMongo({ email: "wrong@example.com", password: "secret" }),
    ).resolves.toMatchObject({ success: false });

    getSiteContentDocument.mockResolvedValueOnce({
      email: "admin@example.com",
    });
    await expect(
      authenticateFixedUserFromMongo({ email: "admin@example.com", password: "secret" }),
    ).resolves.toMatchObject({
      success: false,
      message: "login-user document needs passwordHash.",
    });

    getSiteContentDocument.mockResolvedValueOnce({
      email: "admin@example.com",
      passwordHash,
    });
    await expect(
      authenticateFixedUserFromMongo({ email: "", password: "secret" }),
    ).resolves.toMatchObject({ success: false });
  });
});
