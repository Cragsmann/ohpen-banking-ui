import { rootDomain } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

function extractSubdomains(request: NextRequest): string[] | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Local development environment
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Extract subdomains from hostname, e.g. 'sub1.sub2.localhost'
    if (hostname.endsWith(".localhost")) {
      const parts = hostname.split(".");
      // Remove 'localhost' from the end
      if (parts.length > 1) {
        return parts.slice(0, parts.length - 1);
      }
    }
    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(":")[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    return hostname.split("---");
  }

  if (
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`)
  ) {
    const withoutRoot = hostname.replace(`.${rootDomainFormatted}`, "");
    const parts = withoutRoot.split(".");
    return parts.length ? parts : null;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  try {
    if (request.method !== "GET" || request.headers.has("x-rewrite-from")) {
      return NextResponse.next();
    }

    const parts = extractSubdomains(request);
    console.log(`[DEBUG] Middleware invoked for: ${request.url}`);
    console.log(`[DEBUG] Host: ${host}`);
    console.log(`[DEBUG] Pathname: ${pathname}`);
    console.log(`[DEBUG] parts: ${parts}`);

    if (!parts || parts.length === 0) {
      return NextResponse.next();
    }

    const [tenant, label] = parts;

    if (parts.length === 2) {
      return NextResponse.rewrite(
        new URL(`/tenant/${tenant}/${label}${pathname}`, request.url)
      );
    }

    if (parts.length === 1) {
      return NextResponse.rewrite(
        new URL(`/tenant/${tenant}${pathname}`, request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    console.log(
      `[DEBUG] No specific middleware rule matched. Passing through.`
    );

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico, /robots.txt)
     * 4. Files with extensions (e.g., .js, .css, .png, etc.)
     * This `matcher` config is good and should work with the middleware logic.
     */
    "/((?!api|_next|[\\w-]+\\.\\w+).*)",
  ],
};
