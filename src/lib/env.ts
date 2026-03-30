import { getSecret } from "astro:env/server";

function isRealConnectionString(value: string | undefined) {
  return Boolean(value && value.length > 0 && !value.includes("[YOUR-PASSWORD]"));
}

function isConfiguredPublicValue(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

export function getConfiguredDatabaseUrl() {
  const candidates = [
    getSecret("DATABASE_URL"),
    getSecret("DIRECT_URL"),
    process.env.DATABASE_URL,
    process.env.DIRECT_URL,
  ];

  return candidates.find(isRealConnectionString);
}

export function hasConfiguredDatabaseUrl() {
  return Boolean(getConfiguredDatabaseUrl());
}

export function getConfiguredSupabaseUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
    getSecret("NEXT_PUBLIC_SUPABASE_URL"),
  ];

  return candidates.find(isConfiguredPublicValue)?.trim();
}

export function getConfiguredSupabasePublishableKey() {
  const candidates = [
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    getSecret("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"),
  ];

  return candidates.find(isConfiguredPublicValue)?.trim();
}
