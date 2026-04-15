'use server';

import { put, list } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { normalizeProduct, prepareProductsForStorage } from '@/utils/product';

const PRODUCTS_JSON_PATH = 'config/products.json';

// Busca a lista de produtos
export async function getProductsData() {
  try {
    const { blobs } = await list({ prefix: PRODUCTS_JSON_PATH });
    if (blobs.length === 0) return [];

    const response = await fetch(blobs[0].url);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

// Salva a lista completa de produtos
export async function saveProductsList(productsArray) {
  try {
    const sanitizedProducts = prepareProductsForStorage(productsArray);

    await put(PRODUCTS_JSON_PATH, JSON.stringify(sanitizedProducts), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    revalidatePath('/'); 
    return { success: true, data: sanitizedProducts };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getProductById(productId) {
  try {
    const products = await getProductsData();
    const found = products.find((product) => String(product?.id) === String(productId));
    return normalizeProduct(found);
  } catch (error) {
    console.error('Erro ao buscar produto por id:', error);
    return null;
  }
}