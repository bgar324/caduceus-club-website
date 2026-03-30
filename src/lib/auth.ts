import type { AstroCookies } from "astro";
import { createClient } from "@supabase/supabase-js";
import type { EmailOtpType, Session, User } from "@supabase/supabase-js";
import {
  getConfiguredSupabasePublishableKey,
  getConfiguredSupabaseServiceRoleKey,
  getConfiguredSupabaseUrl,
} from "./env";

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

export function isAdminInviteConfigured() {
  return Boolean(isAdminAuthConfigured() && getConfiguredSupabaseServiceRoleKey());
}

export function isSupabaseAdminUser(user: User | null | undefined) {
  if (!user) {
    return false;
  }

  const appMetadata =
    user.app_metadata && typeof user.app_metadata === "object" ? user.app_metadata : {};

  return appMetadata.role === "admin";
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

function getSupabaseAdminClient() {
  const supabaseUrl = getConfiguredSupabaseUrl();
  const supabaseServiceRoleKey = getConfiguredSupabaseServiceRoleKey();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase admin invites are not configured.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
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

export async function inviteAdminByEmail(email: string, redirectTo: string) {
  const supabase = getSupabaseAdminClient();
  const normalizedEmail = email.trim().toLowerCase();
  const inviteResult = await supabase.auth.admin.inviteUserByEmail(normalizedEmail, {
    redirectTo,
  });

  if (inviteResult.error || !inviteResult.data.user) {
    return inviteResult;
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
    return {
      data: inviteResult.data,
      error: updateResult.error,
    };
  }

  return inviteResult;
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

export async function setSupabaseSessionFromTokens(
  cookies: AstroCookies,
  accessToken: string,
  refreshToken: string,
) {
  const supabase = getSupabaseAuthClient();
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken.trim(),
    refresh_token: refreshToken.trim(),
  });

  if (error || !data.session) {
    return {
      data,
      error,
    };
  }

  setSupabaseSession(cookies, data.session);

  return {
    data,
    error: null,
  };
}

export async function verifySupabaseInviteToken(cookies: AstroCookies, tokenHash: string) {
  const supabase = getSupabaseAuthClient();
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash.trim(),
    type: "invite" satisfies EmailOtpType,
  });

  if (error || !data.session) {
    return {
      data,
      error,
    };
  }

  setSupabaseSession(cookies, data.session);

  return {
    data,
    error: null,
  };
}

export async function updateSupabasePassword(cookies: AstroCookies, password: string) {
  const accessToken = getAccessToken(cookies);
  const refreshToken = getRefreshToken(cookies);

  if (!accessToken || !refreshToken) {
    throw new Error("You need an active invite or login session before setting a password.");
  }

  const supabase = getSupabaseAuthClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (sessionError || !sessionData.session) {
    throw new Error("Your invite session is invalid or expired. Request a new invite.");
  }

  setSupabaseSession(cookies, sessionData.session);

  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  return {
    data,
    error,
  };
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
