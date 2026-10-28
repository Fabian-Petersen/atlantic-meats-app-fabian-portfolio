// utils/compressToWebp.ts
import imageCompression from "browser-image-compression";

const ORIGINAL_IMAGE_FALLBACK_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
]);

export async function compressImagesToWebpv1(files: File[]) {
  const baseOptions = {
    maxSizeMB: 0.5, // target size per image
    maxWidthOrHeight: 1920, // prevent huge images
    useWebWorker: true,
    initialQuality: 0.8,
  };

  const compressedFiles: File[] = [];

  // Process one image at a time to keep peak memory usage low on mobile devices.
  for (const file of files) {
    try {
      const compressed = await imageCompression(file, {
        ...baseOptions,
        fileType: "image/webp",
      });
      compressedFiles.push(
        new File([compressed], file.name.replace(/\.\w+$/, ".webp"), {
          type: "image/webp",
        }),
      );
    } catch (error) {
      if (ORIGINAL_IMAGE_FALLBACK_TYPES.has(file.type)) {
        console.warn(
          `[image-compression] WebP conversion failed for ${file.name}; trying JPEG compression instead.`,
          error,
        );

        try {
          const jpeg = await imageCompression(file, {
            ...baseOptions,
            fileType: "image/jpeg",
          });
          const normalizedJpeg = new File(
            [jpeg],
            file.name.replace(/\.\w+$/, ".jpg"),
            { type: "image/jpeg" },
          );

          // Some mobile screenshots fail direct WebP conversion. Normalizing
          // them to JPEG first gives the encoder a simpler input while still
          // keeping the API and presigned S3 upload on the working WebP path.
          const normalizedWebp = await imageCompression(normalizedJpeg, {
            ...baseOptions,
            fileType: "image/webp",
          });
          compressedFiles.push(
            new File(
              [normalizedWebp],
              file.name.replace(/\.\w+$/, ".webp"),
              { type: "image/webp" },
            ),
          );
          continue;
        } catch (jpegError) {
          console.error(
            `[image-compression] Screenshot normalization failed for ${file.name}.`,
            jpegError,
          );
          throw new Error(
            `The image ${file.name} could not be converted to a supported WebP upload.`,
          );
        }
      }

      throw error;
    }
  }

  return compressedFiles;
}
