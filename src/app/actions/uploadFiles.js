'use server';

import { sanitizeImageSrc } from '@/utils/url';

export async function uploadImage(formData) {
  const imageUrl = String(formData.get('imageUrl') || '').trim();

  if (!imageUrl) {
    throw new Error('Nenhuma URL de imagem informada');
  }

  return sanitizeImageSrc(imageUrl, '');
}
