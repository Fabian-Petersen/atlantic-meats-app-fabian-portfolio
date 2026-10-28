// utils/compressToWebp.ts
import imageCompression from "browser-image-compression";

const ORIGINAL_IMAGE_FALLBACK_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
]);

export async function compressImagesToWebpv1(files: File[]) {
  const options = {
    maxSizeMB: 0.5, // target size per image
    maxWidthOrHeight: 1920, // prevent huge images
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.8,
  };

  const compressedFiles: File[] = [];

  // Process one image at a time to keep peak memory usage low on mobile devices.
  for (const file of files) {
    try {
      const compressed = await imageCompression(file, options);
      compressedFiles.push(
        new File([compressed], file.name.replace(/\.\w+$/, ".webp"), {
          type: "image/webp",
        }),
      );
    } catch (error) {
      if (ORIGINAL_IMAGE_FALLBACK_TYPES.has(file.type)) {
        console.warn(
          `[image-compression] WebP conversion failed for ${file.name}; uploading the original ${file.type} file instead.`,
          error,
        );
        compressedFiles.push(file);
        continue;
      }

      throw error;
    }
  }

  return compressedFiles;
}
