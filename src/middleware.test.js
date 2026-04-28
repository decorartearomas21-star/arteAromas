import { describe, expect, it, vi } from "vitest";

vi.mock("./lib/auth.shared", () => ({
  SESSION_COOKIE_NAME: "x-tenant",
  verifySessionCookieEdge: vi.fn(),
}));

import { middleware } from "./middleware";
import { verifySessionCookieEdge } from "./lib/auth.shared";

describe("middleware", () => {
  it("redirects when the session cookie is missing", async () => {
    delete process.env.COOKIE_SECRET;

    const request = {
      nextUrl: {
        pathname: "/painel",
        searchParams: new URLSearchParams(),
        clone() {
          return new URL("https://example.com/painel");
        },
      },
      cookies: { get: () => null },
    };

    const response = await middleware(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/artesao?from=%2Fpainel");
  });

  it("passes through when the session is valid", async () => {
    process.env.COOKIE_SECRET = "secret";
    verifySessionCookieEdge.mockResolvedValue(true);

    const request = {
      nextUrl: {
        pathname: "/painel",
        searchParams: new URLSearchParams(),
        clone() {
          return new URL("https://example.com/painel");
        },
      },
      cookies: { get: () => ({ value: "cookie" }) },
    };

    const response = await middleware(request);
    expect(response.status).toBe(200);
    expect(verifySessionCookieEdge).toHaveBeenCalledWith("cookie", "secret");
  });

  it("clears invalid sessions", async () => {
    process.env.COOKIE_SECRET = "secret";
    verifySessionCookieEdge.mockResolvedValue(false);

    const request = {
      nextUrl: {
        pathname: "/painel",
        searchParams: new URLSearchParams(),
        clone() {
          return new URL("https://example.com/painel");
        },
      },
      cookies: { get: () => ({ value: "cookie" }) },
    };

    const response = await middleware(request);
    expect(response.status).toBe(307);
    expect(verifySessionCookieEdge).toHaveBeenCalledWith("cookie", "secret");
  });
});
