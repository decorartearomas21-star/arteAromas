import { describe, expect, it } from "vitest";
import { uploadImage } from "./uploadFiles";

describe("uploadImage", () => {
  it("returns a sanitized image url or throws when missing", async () => {
    const formData = new Map([["imageUrl", "https://example.com/a.png"]]);
    formData.get = formData.get.bind(formData);

    await expect(uploadImage(formData)).resolves.toBe("https://example.com/a.png");
    await expect(uploadImage(new Map())).rejects.toThrow("Nenhuma URL de imagem informada");
  });
});
