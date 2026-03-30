import type { APIRoute } from "astro";
import {
  getSafeNextPath,
  isAdminAuthConfigured,
  isSupabaseAdminUser,
  redirectToLogin,
  setSupabaseSession,
  signInWithSupabasePassword,
} from "../../../lib/auth";

function getStringValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const email = getStringValue(formData, "email");
  const password = getStringValue(formData, "password");
  const nextPath = getSafeNextPath(getStringValue(formData, "next"));

  if (!isAdminAuthConfigured()) {
    return redirectToLogin("auth-not-configured", nextPath);
  }

  const { data, error } = await signInWithSupabasePassword(email, password);

  if (error || !data.session) {
    return redirectToLogin("invalid-credentials", nextPath);
  }

  if (!isSupabaseAdminUser(data.user)) {
    return redirectToLogin("not-authorized", nextPath);
  }

  setSupabaseSession(cookies, data.session);

  return new Response(null, {
    status: 303,
    headers: {
      Location: nextPath,
    },
  });
};
