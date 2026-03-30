import type { APIRoute } from "astro";
import { inviteAdminByEmail, isAdminInviteConfigured } from "../../../lib/auth";
import { redirectToCms } from "../../../lib/cms";

function getEmailValue(formData: FormData) {
  const value = formData.get("email");

  return typeof value === "string" ? value.trim() : "";
}

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email = getEmailValue(formData);

  if (!email) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/cms?error=${encodeURIComponent("Enter an email address before sending the invite.")}`,
      },
    });
  }

  if (!isAdminInviteConfigured()) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/cms?error=${encodeURIComponent(
          "Admin invites are not configured. Set SUPABASE_SERVICE_ROLE_KEY on the server.",
        )}`,
      },
    });
  }

  const redirectTo = new URL("/cms/set-password", request.url).toString();
  const { error } = await inviteAdminByEmail(email, redirectTo);

  if (error) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/cms?error=${encodeURIComponent(error.message)}`,
      },
    });
  }

  return redirectToCms("admin-invite-sent");
};
