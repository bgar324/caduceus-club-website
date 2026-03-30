import type { APIRoute } from "astro";
import {
  isAdminAuthConfigured,
  setSupabaseSessionFromTokens,
  verifySupabaseInviteToken,
} from "../../../lib/auth";

function redirectToSetPassword(status?: string, error?: string) {
  const searchParams = new URLSearchParams();

  if (status) {
    searchParams.set("status", status);
  }

  if (error) {
    searchParams.set("error", error);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: `/cms/set-password${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`,
    },
  });
}

function getStringValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value.trim() : "";
}

export const GET: APIRoute = async ({ url, cookies }) => {
  if (!isAdminAuthConfigured()) {
    return redirectToSetPassword(undefined, "Supabase auth is not configured.");
  }

  const tokenHash = url.searchParams.get("token_hash")?.trim() ?? "";
  const type = url.searchParams.get("type")?.trim() ?? "";

  if (!tokenHash || type !== "invite") {
    return redirectToSetPassword(undefined, "This invite link is invalid or expired.");
  }

  const { error } = await verifySupabaseInviteToken(cookies, tokenHash);

  if (error) {
    return redirectToSetPassword(undefined, "This invite link is invalid or expired.");
  }

  return redirectToSetPassword("invite-accepted");
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAdminAuthConfigured()) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Supabase auth is not configured.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const formData = await request.formData();
  const accessToken = getStringValue(formData, "accessToken");
  const refreshToken = getStringValue(formData, "refreshToken");

  if (!accessToken || !refreshToken) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "The invite session is missing required tokens.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const { error } = await setSupabaseSessionFromTokens(cookies, accessToken, refreshToken);

  if (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "This invite link is invalid or expired.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
