import { describe, expect, it, vi } from "vitest";
import { createSessionCookieValue } from "./auth.server";
import { SESSION_MAX_AGE_SECONDS, verifySessionCookieEdge } from "./auth.shared";

describe("auth.shared", () => {
  it("verifies valid cookies and rejects invalid ones", async () => {
    const now = 1_700_000_000_000;
    vi.spyOn(Date, "now").mockReturnValue(now);
    const secret = "secret";
    const cookieValue = createSessionCookieValue("user-1", secret);

    await expect(verifySessionCookieEdge(cookieValue, secret)).resolves.toBe(true);
    await expect(verifySessionCookieEdge(cookieValue, "")).resolves.toBe(false);
    await expect(verifySessionCookieEdge("bad.cookie", secret)).resolves.toBe(false);
    await expect(verifySessionCookieEdge("user.123.nonce.short", secret)).resolves.toBe(false);

    vi.spyOn(Date, "now").mockReturnValue(now + (SESSION_MAX_AGE_SECONDS + 1) * 1000);
    await expect(verifySessionCookieEdge(cookieValue, secret)).resolves.toBe(false);

    vi.spyOn(Date, "now").mockReturnValue(now - 1000);
    await expect(verifySessionCookieEdge(cookieValue, secret)).resolves.toBe(false);
  });
});
