import PagePdp from "./pdp";
import { getProductHighlightsData } from "@/app/actions/productHighlights";

export default async function Page({ params }) {
  const { id } = await params;
  const productHighlights = await getProductHighlightsData();

  return <PagePdp productId={id} productHighlights={productHighlights} />;
}
