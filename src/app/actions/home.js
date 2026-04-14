'use server';

import { getBannerData } from '@/app/actions/banner';
import { getTextsData } from '@/app/actions/texts';
import { getProductsData } from '@/app/actions/products';
import { normalizeProducts } from '@/utils/product';

function normalizeTexts(textsData) {
  if (Array.isArray(textsData)) {
    return textsData.map((item) => String(item || '').trim()).filter(Boolean);
  }

  if (!textsData || typeof textsData !== 'object') return [];

  return Object.keys(textsData)
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .map((key) => String(textsData[key] || '').trim())
    .filter(Boolean);
}

function getFeaturedComments(products) {
  if (!Array.isArray(products)) return [];

  return products.flatMap((product) =>
    (product.comments || []).filter(
      (comment) => comment.showOnHome && (comment.name || comment.phrase || comment.image),
    ),
  );
}

export async function getHomeData() {
  try {
    const [banner, textsRaw, productsRaw] = await Promise.all([
      getBannerData(),
      getTextsData(),
      getProductsData(),
    ]);

    const products = normalizeProducts(productsRaw);
    const comments = getFeaturedComments(products);

    return {
      banner: banner || null,
      texts: normalizeTexts(textsRaw),
      products,
      launches: products.slice(-3).reverse(),
      comments,
    };
  } catch (error) {
    return {
      banner: null,
      texts: [],
      products: [],
      launches: [],
      comments: [],
    };
  }
}
