// utils/compressToWebp.ts
import imageCompression from "browser-image-compression";

export async function compressImagesToWebp(files: File[]) {
  const options = {
    maxSizeMB: 0.5, // target size per image
    maxWidthOrHeight: 1920, // prevent huge images
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.8,
  };

  return Promise.all(
    files.map(async (file) => {
      const compressed = await imageCompression(file, options);
      return new File([compressed], file.name.replace(/\.\w+$/, ".webp"), {
        type: "image/webp",
      });
    })
  );
}
