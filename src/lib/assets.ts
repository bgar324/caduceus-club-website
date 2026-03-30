import { getPrismaClient } from "./prisma";

const MAX_IMAGE_UPLOAD_BYTES = 4 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

export function getUploadedAssetUrl(assetId: string) {
  return `/api/assets/${assetId}`;
}

export async function createUploadedAsset(file: File) {
  if (file.size === 0) {
    throw new Error("The selected image file is empty.");
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error("The selected image exceeds the 4 MB upload limit.");
  }

  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Unsupported image format. Use PNG, JPG, WebP, GIF, AVIF, or SVG.");
  }

  const prisma = getPrismaClient();
  const binaryData = Buffer.from(await file.arrayBuffer());
  const uploadedAssetDelegate = (prisma as { uploadedAsset?: { create?: Function } }).uploadedAsset;
  const asset =
    typeof uploadedAssetDelegate?.create === "function"
      ? await uploadedAssetDelegate.create({
          data: {
            mimeType: file.type,
            data: binaryData,
          },
        })
      : (
          await prisma.$queryRaw<Array<{ id: string }>>`
            INSERT INTO "UploadedAsset" ("id", "mimeType", "data", "createdAt")
            VALUES (${crypto.randomUUID()}, ${file.type}, ${binaryData}, NOW())
            RETURNING "id"
          `
        )[0];

  if (!asset?.id) {
    throw new Error("The uploaded image could not be saved.");
  }

  return {
    id: asset.id,
    url: getUploadedAssetUrl(asset.id),
  };
}

export async function getUploadedAssetById(id: string) {
  const prisma = getPrismaClient();
  const uploadedAssetDelegate = (prisma as { uploadedAsset?: { findUnique?: Function } }).uploadedAsset;

  if (typeof uploadedAssetDelegate?.findUnique === "function") {
    return uploadedAssetDelegate.findUnique({
      where: { id },
    });
  }

  return (
    await prisma.$queryRaw<
      Array<{ id: string; mimeType: string; data: Uint8Array; createdAt: Date }>
    >`
      SELECT "id", "mimeType", "data", "createdAt"
      FROM "UploadedAsset"
      WHERE "id" = ${id}
      LIMIT 1
    `
  )[0] ?? null;
}
