import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const firstArgument = process.argv[2]?.trim() ?? "";
const email = firstArgument.toLowerCase();
const siteUrl = (process.argv[3] ?? process.env.SITE_URL ?? process.env.PUBLIC_SITE_URL ?? "").trim();
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

if (firstArgument === "--help" || firstArgument === "-h") {
  console.log("Usage: npm run admin:invite -- admin@example.com https://caduceuswebsitev1.vercel.app");
  process.exit(0);
}

if (!email) {
  console.error("Usage: npm run admin:invite -- admin@example.com https://caduceuswebsitev1.vercel.app");
  process.exit(1);
}

if (!supabaseUrl) {
  console.error("NEXT_PUBLIC_SUPABASE_URL is required.");
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required.");
  process.exit(1);
}

if (!siteUrl) {
  console.error("Provide the deployed site URL as the second argument or set SITE_URL.");
  process.exit(1);
}

const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
const redirectTo = `${normalizedSiteUrl}/cms/set-password`;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

const inviteResult = await supabase.auth.admin.inviteUserByEmail(email, {
  redirectTo,
});

if (inviteResult.error || !inviteResult.data.user) {
  console.error(inviteResult.error?.message ?? "Failed to invite admin.");
  process.exit(1);
}

const currentAppMetadata =
  inviteResult.data.user.app_metadata && typeof inviteResult.data.user.app_metadata === "object"
    ? inviteResult.data.user.app_metadata
    : {};

const updateResult = await supabase.auth.admin.updateUserById(inviteResult.data.user.id, {
  app_metadata: {
    ...currentAppMetadata,
    role: "admin",
  },
});

if (updateResult.error) {
  console.error(updateResult.error.message);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      invitedEmail: email,
      redirectTo,
      role: "admin",
      userId: inviteResult.data.user.id,
    },
    null,
    2,
  ),
);
