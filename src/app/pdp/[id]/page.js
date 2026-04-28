import PagePdp from "./pdp";
import { getProductHighlightsData } from "@/app/actions/productHighlights";
import { getProductById } from "@/lib/products";
import { getSiteOrigin, sanitizeImageSrc } from "@/utils/url";

const siteOrigin = getSiteOrigin();

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  const productName = product?.name || "Decor Arte Aromas";
  const productDescription =
    product?.description?.trim() || "Velas e itens para relaxar & transformar ambientes.";
  const productImagePath = sanitizeImageSrc(product?.image || "/banner.jpg", "/banner.jpg");
  const productImageUrl = new URL(productImagePath, siteOrigin).toString();
  const productUrl = new URL(`/pdp/${id}`, siteOrigin).toString();

  return {
    title: `${productName} | Decor Arte Aromas`,
    description: productDescription,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: productName,
      description: productDescription,
      url: productUrl,
      images: [
        {
          url: productImageUrl,
          width: 1200,
          height: 1200,
          alt: productName,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description: productDescription,
      images: [productImageUrl],
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const productHighlights = await getProductHighlightsData();

  return <PagePdp productId={id} productHighlights={productHighlights} />;
}
