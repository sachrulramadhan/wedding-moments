/**
 * Utility functions for client-side image compression, thumbnailing,
 * and format validation.
 */

export interface ProcessedImage {
  imageUrl: string;
  thumbnailUrl: string;
  aspectRatio: number;
  width: number;
  height: number;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Please upload a JPG, JPEG, PNG, or WEBP image file.',
    };
  }

  // 25MB max size limit
  const maxBytes = 25 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: 'Image is too large (maximum 25MB). Please choose a smaller photo.',
    };
  }

  return { valid: true };
}

export async function processImageFile(
  fileOrBlob: File | Blob,
  maxDimension = 1800,
  thumbDimension = 480
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image into memory.'));
      img.onload = () => {
        try {
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;
          const aspectRatio = width / (height || 1);

          // 1. High-res display version
          let targetW = width;
          let targetH = height;
          if (targetW > maxDimension || targetH > maxDimension) {
            if (targetW > targetH) {
              targetW = maxDimension;
              targetH = Math.round(maxDimension / aspectRatio);
            } else {
              targetH = maxDimension;
              targetW = Math.round(maxDimension * aspectRatio);
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not initialize canvas context.');

          // Smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetW, targetH);
          const fullDataUrl = canvas.toDataURL('image/jpeg', 0.88);

          // 2. Thumbnail version
          let thumbW = width;
          let thumbH = height;
          if (thumbW > thumbDimension || thumbH > thumbDimension) {
            if (thumbW > thumbH) {
              thumbW = thumbDimension;
              thumbH = Math.round(thumbDimension / aspectRatio);
            } else {
              thumbH = thumbDimension;
              thumbW = Math.round(thumbDimension * aspectRatio);
            }
          }

          const thumbCanvas = document.createElement('canvas');
          thumbCanvas.width = thumbW;
          thumbCanvas.height = thumbH;
          const thumbCtx = thumbCanvas.getContext('2d');
          if (!thumbCtx) throw new Error('Could not initialize thumbnail canvas.');
          thumbCtx.imageSmoothingEnabled = true;
          thumbCtx.imageSmoothingQuality = 'medium';
          thumbCtx.drawImage(img, 0, 0, thumbW, thumbH);
          const thumbDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.75);

          resolve({
            imageUrl: fullDataUrl,
            thumbnailUrl: thumbDataUrl,
            aspectRatio,
            width: targetW,
            height: targetH,
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(fileOrBlob);
  });
}
