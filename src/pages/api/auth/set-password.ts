import type { APIRoute } from "astro";
import { isAdminAuthConfigured, updateSupabasePassword } from "../../../lib/auth";

function getStringValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value.trim() : "";
}

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

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const password = getStringValue(formData, "password");
  const confirmPassword = getStringValue(formData, "confirmPassword");

  if (!isAdminAuthConfigured()) {
    return redirectToSetPassword(undefined, "Supabase auth is not configured.");
  }

  if (!password) {
    return redirectToSetPassword(undefined, "Enter a password.");
  }

  if (password !== confirmPassword) {
    return redirectToSetPassword(undefined, "Passwords do not match.");
  }

  const { error } = await updateSupabasePassword(cookies, password);

  if (error) {
    return redirectToSetPassword(undefined, error.message);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/cms?status=password-set",
    },
  });
};
