import type { APIRoute } from "astro";
import { signOutFromSupabase } from "../../../lib/auth";

export const POST: APIRoute = async ({ cookies }) => {
  await signOutFromSupabase(cookies);

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/cms/login?status=logged-out",
    },
  });
};
