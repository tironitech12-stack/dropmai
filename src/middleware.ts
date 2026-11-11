import { NextRequest, NextResponse } from "next/server";
import {
  extractSubdomainSlug,
  isLikelyCustomDomain,
  isPlatformHost,
} from "@/lib/subdomain";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/loja/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Vercel / localhost / apex → marketing landing & seller app as-is
  if (isPlatformHost(host)) {
    return NextResponse.next();
  }

  const slug = extractSubdomainSlug(host);
  if (slug) {
    const url = request.nextUrl.clone();
    url.pathname = `/loja/${slug}${pathname === "/" ? "" : pathname}`;
    const res = NextResponse.rewrite(url);
    res.headers.set("x-dropmai-store-slug", slug);
    return res;
  }

  if (isLikelyCustomDomain(host)) {
    const url = request.nextUrl.clone();
    url.pathname = `/loja/_domain`;
    url.searchParams.set("host", host?.split(":")[0] ?? "");
    url.searchParams.set("path", pathname);
    const res = NextResponse.rewrite(url);
    res.headers.set("x-dropmai-custom-domain", host ?? "");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
