'use server';

import { revalidatePath } from 'next/cache';
import {
  getSiteContentDocument,
  saveSiteContentDocument,
} from '@/lib/site-content';
import {
  DEFAULT_PRODUCT_HIGHLIGHTS,
  normalizeProductHighlight,
  normalizeProductHighlightsPayload,
} from '@/lib/product-highlights';

const PRODUCT_HIGHLIGHTS_COLLECTION_NAME = 'site_product_highlights';

export async function getProductHighlightsData() {
  try {
    const data = await getSiteContentDocument(
      PRODUCT_HIGHLIGHTS_COLLECTION_NAME,
      { items: DEFAULT_PRODUCT_HIGHLIGHTS },
    );

    return normalizeProductHighlightsPayload(data);
  } catch (error) {
    console.error("Erro ao buscar destaques da PDP:", error);
    return DEFAULT_PRODUCT_HIGHLIGHTS;
  }
}

export async function saveProductHighlights(payload) {
  try {
    const normalizedItems = normalizeProductHighlightsPayload(payload);
    const itemsToSave = normalizedItems
      .map((item, index) => normalizeProductHighlight(item, index))
      .filter(Boolean);

    const data = {
      items: itemsToSave.length ? itemsToSave : DEFAULT_PRODUCT_HIGHLIGHTS,
    };

    await saveSiteContentDocument(PRODUCT_HIGHLIGHTS_COLLECTION_NAME, data);

    revalidatePath('/pdp/[id]', 'page');
    return { success: true, data: data.items };
  } catch (error) {
    console.error("Erro ao salvar destaques da PDP:", error);
    return { success: false, error: error.message };
  }
}

