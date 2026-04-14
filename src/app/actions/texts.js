'use server';

import { put, list } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

const TEXTS_JSON_PATH = 'config/texts.json';

function normalizeTextsPayload(payload) {
  if (Array.isArray(payload)) {
    return payload.map((item) => String(item || '').trim()).filter(Boolean);
  }

  if (payload && typeof payload === 'object') {
    return Object.keys(payload)
      .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))
      .map((key) => String(payload[key] || '').trim())
      .filter(Boolean);
  }

  return [];
}

// Busca os textos salvos
export async function getTextsData() {
  try {
    const { blobs } = await list({ prefix: TEXTS_JSON_PATH });
    if (blobs.length === 0) return [];

    const response = await fetch(blobs[0].url);
    const data = await response.json();
    return normalizeTextsPayload(data);
  } catch (error) {
    console.error("Erro ao buscar textos:", error);
    return [];
  }
}

// Salva o novo conjunto de frases
export async function saveTexts(phrasesData) {
  try {
    const normalizedTexts = normalizeTextsPayload(phrasesData);

    await put(TEXTS_JSON_PATH, JSON.stringify(normalizedTexts), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    revalidatePath('/'); // Atualiza o cache da home/site
    return { success: true, data: normalizedTexts };
  } catch (error) {
    console.error("Erro ao salvar textos:", error.message);
    return { success: false, error: error.message };
  }
}