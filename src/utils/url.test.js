import { describe, expect, it } from "vitest";
import {
  isRenderableImageSrc,
  sanitizeHttpUrl,
  sanitizeImageSrc,
  sanitizeLinkHref,
} from "./url";

describe("url utils", () => {
  it("sanitizes http and https urls", () => {
    expect(sanitizeHttpUrl("https://example.com/image.png")).toBe("https://example.com/image.png");
    expect(sanitizeHttpUrl("http://example.com/image.png")).toBe("http://example.com/image.png");
  });

  it("accepts relative paths and falls back for invalid values", () => {
    expect(sanitizeHttpUrl("/banner.jpg")).toBe("/banner.jpg");
    expect(sanitizeHttpUrl("")).toBe("/banner.jpg");
    expect(sanitizeHttpUrl("javascript:alert(1)")).toBe("/banner.jpg");
  });

  it("sanitizes link hrefs and image srcs", () => {
    expect(sanitizeLinkHref("/home")).toBe("/home");
    expect(sanitizeLinkHref("#galeria")).toBe("#galeria");
    expect(sanitizeLinkHref("https://example.com")).toBe("https://example.com/");
    expect(sanitizeLinkHref("not-a-link")).toBe("/");
    expect(sanitizeImageSrc("https://example.com/a.png")).toBe("https://example.com/a.png");
  });

  it("detects renderable image sources", () => {
    expect(isRenderableImageSrc("https://example.com/a.png")).toBe(true);
    expect(isRenderableImageSrc("")).toBe(false);
  });
});
