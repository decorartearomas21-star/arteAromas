import { ImageResponse } from "next/og";
import { getProductById } from "@/lib/products";
import { getSiteOrigin, sanitizeImageSrc } from "@/utils/url";

export const alt = "Decor Arte Aromas";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const siteOrigin = getSiteOrigin();

async function getImageDataUrl(imageUrl) {
  if (!imageUrl) return null;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const contentTypeHeader = response.headers.get("content-type") || "image/png";
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return `data:${contentTypeHeader};base64,${base64}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  const productName = product?.name || "Decor Arte Aromas";
  const productDescription =
    product?.description?.trim() || "Velas e itens para relaxar & transformar ambientes.";
  const productImagePath = sanitizeImageSrc(product?.image || "/banner.jpg", "/banner.jpg");
  const productImageUrl = new URL(productImagePath, siteOrigin).toString();
  const embeddedImage = await getImageDataUrl(productImageUrl);
  const logoImageUrl = new URL("/logo.jpg", siteOrigin).toString();
  const embeddedLogo = await getImageDataUrl(logoImageUrl);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #111111 0%, #2b2319 55%, #4a3423 100%)",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            padding: 48,
            gap: 36,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              flex: "0 0 520px",
              height: "100%",
              borderRadius: 36,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
              boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {embeddedImage ? (
              <img
                src={embeddedImage}
                alt={productName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              embeddedLogo ? (
                <img
                  src={embeddedLogo}
                  alt="Decor Arte Aromas"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 42,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  Decor Arte Aromas
                </div>
              )
            )}
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 24,
              paddingRight: 12,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Decor Arte Aromas
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  fontSize: 64,
                  lineHeight: 1.02,
                  fontWeight: 800,
                  maxWidth: 560,
                }}
              >
                {productName}
              </div>
              <div
                style={{
                  fontSize: 28,
                  lineHeight: 1.35,
                  color: "rgba(255,255,255,0.82)",
                  maxWidth: 560,
                }}
              >
                {productDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
