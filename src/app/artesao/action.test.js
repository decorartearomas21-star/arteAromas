import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth.server", () => ({
  authenticateFixedUserFromMongo: vi.fn(),
  createSessionCookieValue: vi.fn(() => "session-value"),
}));
vi.mock("@/lib/auth.shared", () => ({
  SESSION_COOKIE_NAME: "x-tenant",
}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("redirect");
  }),
}));

import { authenticateFixedUserFromMongo, createSessionCookieValue } from "@/lib/auth.server";
import { cookies } from "next/headers";
import { loginAction } from "./action";

describe("loginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.COOKIE_SECRET = "secret";
    vi.mocked(cookies).mockResolvedValue({ set: vi.fn() });
  });

  it("returns validation errors and auth messages", async () => {
    await expect(loginAction(null, new Map())).resolves.toEqual({ error: "Preencha tudo" });

    vi.mocked(authenticateFixedUserFromMongo).mockResolvedValue({ success: false, message: "Credenciais inválidas" });
    const formData = new Map([
      ["email", "admin@example.com"],
      ["password", "bad"],
    ]);
    formData.get = formData.get.bind(formData);

    await expect(loginAction(null, formData)).resolves.toEqual({ error: "Email ou senha inválidos" });
  });

  it("creates a session cookie on success", async () => {
    vi.mocked(authenticateFixedUserFromMongo).mockResolvedValue({
      success: true,
      user: { id: "user-1" },
      maxAge: 100,
    });

    const cookieStore = { set: vi.fn() };
    vi.mocked(cookies).mockResolvedValue(cookieStore);

    const formData = new Map([
      ["email", "admin@example.com"],
      ["password", "secret"],
    ]);
    formData.get = formData.get.bind(formData);

    await expect(loginAction(null, formData)).rejects.toThrow("redirect");
    expect(vi.mocked(createSessionCookieValue)).toHaveBeenCalledWith("user-1", "secret");
    expect(cookieStore.set).toHaveBeenCalled();
  });
});
