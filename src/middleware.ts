import { defineMiddleware } from "astro:middleware";
import {
  clearSupabaseSession,
  getAuthenticatedSupabaseUser,
  getSafeNextPath,
  isSupabaseAdminUser,
  redirectToLogin,
  setSupabaseSession,
} from "./lib/auth";

function isProtectedDashboardPath(pathname: string) {
  return pathname === "/cms" || pathname.startsWith("/api/cms/");
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, search } = context.url;

  if (pathname === "/cms/login") {
    const { user, refreshedSession } = await getAuthenticatedSupabaseUser(context.cookies);

    if (refreshedSession) {
      setSupabaseSession(context.cookies, refreshedSession);
    }

    if (isSupabaseAdminUser(user)) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: getSafeNextPath(context.url.searchParams.get("next")),
        },
      });
    }

    if (user) {
      clearSupabaseSession(context.cookies);

      return redirectToLogin("not-authorized");
    }

    return next();
  }

  if (!isProtectedDashboardPath(pathname)) {
    return next();
  }

  const { user, refreshedSession } = await getAuthenticatedSupabaseUser(context.cookies);

  if (refreshedSession) {
    setSupabaseSession(context.cookies, refreshedSession);
  }

  if (isSupabaseAdminUser(user)) {
    return next();
  }

  if (user) {
    clearSupabaseSession(context.cookies);

    return redirectToLogin("not-authorized");
  }

  clearSupabaseSession(context.cookies);

  const nextPath = pathname.startsWith("/api/cms/") ? "/cms" : `${pathname}${search}`;

  return redirectToLogin("login-required", nextPath);
});
