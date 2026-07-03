import "server-only";
import sharp from "sharp";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 Mo

export class ImageTooLargeError extends Error {}

async function toDataUri(file: File, resize: sharp.ResizeOptions, quality: number): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImageTooLargeError("L'image dépasse la taille maximale autorisée (5 Mo).");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const output = await sharp(buffer).resize(resize).jpeg({ quality }).toBuffer();
  return `data:image/jpeg;base64,${output.toString("base64")}`;
}

/** Ad visual: fit within 1280x1280, not upscaled. */
export async function fileToAdImageDataUri(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  return toDataUri(file, { width: 1280, height: 1280, fit: "inside", withoutEnlargement: true }, 80);
}

/** Profile photo: square crop, fixed 256x256. */
export async function fileToAvatarDataUri(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  return toDataUri(file, { width: 256, height: 256, fit: "cover" }, 85);
}
