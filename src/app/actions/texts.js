'use server';

import { put, list } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

const TEXTS_JSON_PATH = 'config/texts.json';

// Busca os textos salvos
export async function getTextsData() {
  try {
    const { blobs } = await list({ prefix: TEXTS_JSON_PATH });
    if (blobs.length === 0) return null;

    const response = await fetch(blobs[0].url);
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar textos:", error);
    return null;
  }
}

// Salva o novo conjunto de frases
export async function saveTexts(phrasesObject) {
  try {
    await put(TEXTS_JSON_PATH, JSON.stringify(phrasesObject), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    revalidatePath('/'); // Atualiza o cache da home/site
    return { success: true, data: phrasesObject };
  } catch (error) {
    console.error("Erro ao salvar textos:", error.message);
    return { success: false, error: error.message };
  }
}