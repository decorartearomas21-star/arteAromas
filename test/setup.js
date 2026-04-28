import React from "react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

globalThis.React = React;

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }) => {
    const resolvedHref =
      typeof href === "string"
        ? href
        : href && typeof href === "object" && "pathname" in href
          ? href.pathname
          : "#";

    return React.createElement("a", { href: resolvedHref, ...props }, children);
  },
}));

vi.mock("next/image", () => ({
  default: ({ src, alt = "", ...props }) => {
    const resolvedSrc = typeof src === "string" ? src : "";
    return React.createElement("img", { src: resolvedSrc, alt, ...props });
  },
}));

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), { current: null }],
}));

vi.mock("embla-carousel-autoplay", () => ({
  default: vi.fn(() => ({})),
}));

vi.mock("embla-carousel-auto-scroll", () => ({
  default: vi.fn(() => ({})),
}));

vi.mock("@/app/fonts", () => ({
  inter: { variable: "inter-variable", className: "inter-class" },
  roboto: { variable: "roboto-variable", className: "roboto-class" },
  notoSerif: { variable: "noto-serif-variable", className: "noto-serif-class" },
}));

afterEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = "";
  localStorage.clear();
  sessionStorage.clear();
});
