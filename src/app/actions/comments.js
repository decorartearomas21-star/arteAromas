'use server';

import { put, list } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

const COMMENTS_JSON_PATH = 'config/comments.json';

// Busca a lista de comentários
export async function getCommentsData() {
  try {
    const { blobs } = await list({ prefix: COMMENTS_JSON_PATH });
    if (blobs.length === 0) return [];

    const response = await fetch(blobs[0].url);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return [];
  }
}

// Salva a lista completa de comentários
export async function saveCommentsList(commentsArray) {
  try {
    await put(COMMENTS_JSON_PATH, JSON.stringify(commentsArray), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    revalidatePath('/'); 
    return { success: true, data: commentsArray };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

