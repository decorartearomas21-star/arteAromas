'use server';

import { revalidatePath } from 'next/cache';
import {
  getSiteContentDocument,
  saveSiteContentDocument,
} from '@/lib/site-content';
import { sanitizeImageSrc } from '@/utils/url';

const COMMENTS_COLLECTION_NAME = 'site_comments';

// Busca a lista de comentários
export async function getCommentsData() {
  try {
    const data = await getSiteContentDocument(COMMENTS_COLLECTION_NAME, []);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return [];
  }
}

// Salva a lista completa de comentários
export async function saveCommentsList(commentsArray) {
  try {
    const safeComments = Array.isArray(commentsArray)
      ? commentsArray.map((comment) => ({
          ...comment,
          image: sanitizeImageSrc(comment?.image, ""),
        }))
      : [];

    await saveSiteContentDocument(COMMENTS_COLLECTION_NAME, safeComments);

    revalidatePath('/');
    return { success: true, data: safeComments };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
