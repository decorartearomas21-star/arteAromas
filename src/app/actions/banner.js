'use server';

import { put, list } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

const BANNER_JSON_PATH = 'config/banner.json';

// Busca os dados atuais salvos no Blob
export async function getBannerData() {
  try {
    const { blobs } = await list({ prefix: BANNER_JSON_PATH });
    if (blobs.length === 0) return null;

    const response = await fetch(blobs[0].url);
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function saveBanner(formData) {
  const title = formData.get('title');
  const subTitle = formData.get('subTitle');
  const imageUrl = formData.get('imageUrl');
  
  const primaryButtonText = formData.get('primaryButtonText') || 'Compre Agora';
  const primaryButtonLink = formData.get('primaryButtonLink') || '#lançamentos';
  const secondaryButtonText = formData.get('secondaryButtonText') || 'Ver Coleções';
  const secondaryButtonLink = formData.get('secondaryButtonLink') || '/home';

  try {
    const updatedData = {
      title,
      subTitle,
      imageUrl: String(imageUrl || ''),
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
    };

    await put(BANNER_JSON_PATH, JSON.stringify(updatedData), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    revalidatePath('/'); 
    return { success: true, data: updatedData };

  } catch (error) {
    console.error("Erro na Action:", error.message);
    return { success: false, error: error.message };
  }
}