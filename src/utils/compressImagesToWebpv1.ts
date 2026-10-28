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

  return Promise.all(
    files.map(async (file) => {
      try {
        const compressed = await imageCompression(file, options);
        return new File(
          [compressed],
          file.name.replace(/\.\w+$/, ".webp"),
          {
            type: "image/webp",
          },
        );
      } catch (error) {
        if (ORIGINAL_IMAGE_FALLBACK_TYPES.has(file.type)) {
          console.warn(
            `[image-compression] WebP conversion failed for ${file.name}; uploading the original ${file.type} file instead.`,
            error,
          );
          return file;
        }

        throw error;
      }
    }),
  );
}
