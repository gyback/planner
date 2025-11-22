import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n, type Locale } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): Locale {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = Array.from(i18n.locales);

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, getDefaultLocale(request));

  return locale as Locale;
}

function getDefaultLocale(request: NextRequest): Locale {
  const configuredDomain = i18n.domains.find(
    (domain) => domain.domain === request.nextUrl.basePath,
  );

  if (configuredDomain) {
    return configuredDomain.defaultLocale as Locale;
  }

  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // If you have one
  if (
    [
      "/manifest.json",
      "/favicon.ico",
      // Your other files in `public`
    ].includes(pathname)
  )
    return;

  const cookies = request.cookies || {};
  const langCookie = cookies.get("lang")?.value ?? "";

  // Check if there is any supported locale in the basePath
  const langMissingInCookie = i18n.locales.every(
    (locale) => locale.toLowerCase() !== langCookie.toLowerCase(),
  );

  // Redirect if there is no locale
  if (langMissingInCookie) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    const response = NextResponse.redirect(
      new URL(request.nextUrl.pathname, request.url),
    );
    // Set locale cookie
    response.cookies.set("lang", locale, { path: "/" });
    return response;
  }
  return clerkMiddleware();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
