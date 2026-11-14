const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_INPUT_BYTES = 10 * 1024 * 1024;

// Returns a data URL no larger than maxSide px on its longest side.
export async function fileToResizedDataUrl(
  file: File,
  maxSide = 1024,
  quality = 0.8,
): Promise<string> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error("Use a PNG, JPG, WebP or GIF image.");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("The image is larger than 10 MB.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the image.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // WebP is smallest and keeps transparency; some browsers can't encode it
  let url = canvas.toDataURL("image/webp", quality);
  if (!url.startsWith("data:image/webp")) {
    url = canvas.toDataURL("image/jpeg", quality);
  }
  return url;
}
