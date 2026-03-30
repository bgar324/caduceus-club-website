import type { APIRoute } from "astro";
import { restoreHomepageContent } from "../../../lib/content";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    await restoreHomepageContent(body?.snapshot);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "History restore failed.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
