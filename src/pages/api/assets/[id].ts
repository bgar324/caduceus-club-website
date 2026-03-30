import type { APIRoute } from "astro";
import { getUploadedAssetById } from "../../../lib/assets";

export const GET: APIRoute = async ({ params }) => {
  const assetId = params.id;

  if (!assetId) {
    return new Response("Missing asset id.", { status: 400 });
  }

  const asset = await getUploadedAssetById(assetId);

  if (!asset) {
    return new Response("Asset not found.", { status: 404 });
  }

  return new Response(asset.data, {
    status: 200,
    headers: {
      "Content-Type": asset.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
