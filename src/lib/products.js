import { getSiteContentDocuments } from "@/lib/site-content";
import { normalizeProduct } from "@/utils/product";

const PRODUCTS_COLLECTION_NAME = "site_products";

export async function getProductsData() {
  try {
    const data = await getSiteContentDocuments(PRODUCTS_COLLECTION_NAME, []);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

export async function getProductById(productId) {
  try {
    const products = await getProductsData();
    const found = products.find((product) => String(product?.id) === String(productId));
    return normalizeProduct(found);
  } catch (error) {
    console.error("Erro ao buscar produto por id:", error);
    return null;
  }
}
