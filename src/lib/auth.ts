import type { AstroCookies } from "astro";
import { createClient } from "@supabase/supabase-js";
import type { Session, User } from "@supabase/supabase-js";
import { getConfiguredSupabasePublishableKey, getConfiguredSupabaseUrl } from "./env";

const SUPABASE_ACCESS_TOKEN_COOKIE = "sb-access-token";
const SUPABASE_REFRESH_TOKEN_COOKIE = "sb-refresh-token";
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: import.meta.env.PROD,
    maxAge,
  };
}

export function isAdminAuthConfigured() {
  return Boolean(getConfiguredSupabaseUrl() && getConfiguredSupabasePublishableKey());
}

export function getSafeNextPath(nextPath: string | null | undefined) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/cms";
  }

  if (nextPath.startsWith("//") || nextPath.startsWith("/api/")) {
    return "/cms";
  }

  return nextPath;
}

export function redirectToLogin(errorCode?: string, nextPath?: string) {
  const searchParams = new URLSearchParams();
  const safeNextPath = getSafeNextPath(nextPath);

  if (safeNextPath !== "/cms") {
    searchParams.set("next", safeNextPath);
  }

  if (errorCode) {
    searchParams.set("error", errorCode);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: `/cms/login${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`,
    },
  });
}

function getSupabaseAuthClient() {
  const supabaseUrl = getConfiguredSupabaseUrl();
  const supabasePublishableKey = getConfiguredSupabasePublishableKey();

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase auth is not configured.");
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

function getAccessToken(cookies: AstroCookies) {
  return cookies.get(SUPABASE_ACCESS_TOKEN_COOKIE)?.value ?? null;
}

function getRefreshToken(cookies: AstroCookies) {
  return cookies.get(SUPABASE_REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export function setSupabaseSession(cookies: AstroCookies, session: Session) {
  cookies.set(
    SUPABASE_ACCESS_TOKEN_COOKIE,
    session.access_token,
    getCookieOptions(session.expires_in ?? 60 * 60),
  );
  cookies.set(
    SUPABASE_REFRESH_TOKEN_COOKIE,
    session.refresh_token,
    getCookieOptions(REFRESH_TOKEN_MAX_AGE),
  );
}

export function clearSupabaseSession(cookies: AstroCookies) {
  cookies.delete(SUPABASE_ACCESS_TOKEN_COOKIE, {
    path: "/",
  });
  cookies.delete(SUPABASE_REFRESH_TOKEN_COOKIE, {
    path: "/",
  });
}

export async function signInWithSupabasePassword(email: string, password: string) {
  const supabase = getSupabaseAuthClient();

  return supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
}

export async function signOutFromSupabase(cookies: AstroCookies) {
  const accessToken = getAccessToken(cookies);
  const refreshToken = getRefreshToken(cookies);

  if (accessToken && refreshToken) {
    const supabase = getSupabaseAuthClient();

    try {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // Fall back to clearing cookies locally below.
    }
  }

  clearSupabaseSession(cookies);
}

interface SupabaseAuthResult {
  user: User | null;
  refreshedSession?: Session | null;
}

export async function getAuthenticatedSupabaseUser(cookies: AstroCookies): Promise<SupabaseAuthResult> {
  const supabase = getSupabaseAuthClient();
  const accessToken = getAccessToken(cookies);

  if (accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (!error && data.user) {
      return {
        user: data.user,
      };
    }
  }

  const refreshToken = getRefreshToken(cookies);

  if (!refreshToken) {
    return {
      user: null,
    };
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session || !data.user) {
    return {
      user: null,
    };
  }

  return {
    user: data.user,
    refreshedSession: data.session,
  };
}
