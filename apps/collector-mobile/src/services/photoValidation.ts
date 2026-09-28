import * as FileSystem from 'expo-file-system/legacy';
import type { ImagePickerAsset } from 'expo-image-picker';

import { API_BASE_URL } from '../config/api';

export type PhotoValidationResult = {
  isEwaste: boolean;
  predictedCategory: string;
  selectedCategory: string;
  confidence: number;
  decision: 'ACCEPT' | 'REJECT' | 'VERIFY';
  reason: string;
  modelVersion?: string;
};

export async function validateEwastePhoto(
  asset: ImagePickerAsset,
  selectedCategory: string,
): Promise<PhotoValidationResult> {
  if (!asset?.uri) {
    throw new Error('Image URI is missing');
  }

  if (!selectedCategory) {
    throw new Error('Material category is missing');
  }

  console.log('[AI Upload] Image URI:', asset.uri);
  console.log('[AI Upload] Selected category:', selectedCategory);
  console.log('[AI Upload] API:', `${API_BASE_URL}/ai/validate-image`);
  console.log('[AI Upload] Starting multipart upload...');

  try {
    const response = await FileSystem.uploadAsync(
      `${API_BASE_URL}/ai/validate-image`,
      asset.uri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,

        fieldName: 'file',

        mimeType: asset.mimeType || 'image/jpeg',

        parameters: {
          selected_category: selectedCategory,
        },

        headers: {
          Accept: 'application/json',
        },
      },
    );

    console.log('[AI Upload] HTTP status:', response.status);
    console.log('[AI Upload] Response:', response.body);

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `AI validation failed (${response.status}): ${response.body}`,
      );
    }

    const result =
      JSON.parse(response.body) as PhotoValidationResult;

    console.log('[AI Upload] AI result:', result);

    return result;
  } catch (error) {
    console.error('[AI Upload] Upload error:', error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Unable to validate photo with AI');
  }
}