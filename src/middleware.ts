// import { type NextRequest, NextResponse } from "next/server";
// import { rootDomain } from "@/lib/utils"; // Assuming this is correctly defined

// function extractSubdomains(request: NextRequest): string[] | null {
//   const url = request.url;
//   const host = request.headers.get("host") || "";
//   const hostname = host.split(":")[0];

//   // Local development environment
//   if (url.includes("localhost") || url.includes("127.0.0.1")) {
//     // Extract subdomains from hostname, e.g. 'sub1.sub2.localhost'
//     if (hostname.endsWith(".localhost")) {
//       const parts = hostname.split(".");
//       // Remove 'localhost' from the end
//       if (parts.length > 1) {
//         return parts.slice(0, parts.length - 1);
//       }
//     }
//     return null;
//   }

//   // Production environment
//   const rootDomainFormatted = rootDomain.split(":")[0];

//   // Handle preview deployment URLs (tenant---branch-name.vercel.app)
//   if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
//     return hostname.split("---");
//   }

//   // Regular subdomain detection for tenant.label.domain.com
//   if (
//     hostname !== rootDomainFormatted &&
//     hostname !== `www.${rootDomainFormatted}` &&
//     hostname.endsWith(`.${rootDomainFormatted}`)
//   ) {
//     const withoutRoot = hostname.replace(`.${rootDomainFormatted}`, ""); // tenant.label
//     const parts = withoutRoot.split(".");
//     return parts.length ? parts : null;
//   }

//   return null;
// }

// const IGNORED = ["/api", "/_next", "/favicon.ico"];

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Skip middleware for internal assets or non-GET requests
//   // Also, crucial: Skip if this request has already been rewritten from '/'
//   // The 'x-rewrite-from' header is set by Next.js when a rewrite happens.
//   if (
//     IGNORED.some((p) => pathname.startsWith(p)) ||
//     request.method !== "GET" ||
//     request.headers.has("x-rewrite-from") // This is the key fix!
//   ) {
//     return NextResponse.next();
//   }

//   const parts = extractSubdomains(request);

//   if (!parts || parts.length === 0) {
//     return NextResponse.next();
//   }

//   // Only apply rewrite if the current URL path is exactly '/'
//   // This ensures we only act on the root domain access.
//   if (pathname === "/") {
//     if (parts.length === 2) {
//       // Assuming parts are [label, tenant] based on your rewrite target /${tenant}/${label}
//       // For http://tenant1.sd.localhost:3000/, if extractSubdomains returns ['tenant1', 'sd']
//       // and you want the path /sd/tenant1, then `const [tenant, label] = parts;` is correct if parts[0] is tenant and parts[1] is label
//       // But your current rewrite is `/${tenant}/${label}` from `const [label, tenant] = parts;`
//       // This implies `parts[0]` is `label` and `parts[1]` is `tenant`.
//       // Let's stick to your original variable names and order:
//       // e.g., label='tenant1', tenant='sd' for tenant1.sd.localhost
//       // This seems counter-intuitive based on subdomain structure.
//       // If URL is `tenant1.sd.localhost`, `extractSubdomains` likely returns `['tenant1', 'sd']`.
//       // If `tenant1` is the tenant and `sd` is the label, then `const [tenant, label] = parts;`
//       // would be more natural.
//       // Let's assume `extractSubdomains` gives you `[tenant, label]` directly or adjust its return.
//       // Given your current rewrite `/${tenant}/${label}`, if parts = ['tenant1', 'sd']
//       // and you want /sd/tenant1 then you need `/${parts[1]}/${parts[0]}`.

//       // Re-evaluating based on your original rewrite `/${tenant}/${label}`:
//       // If `parts` is `['tenant1', 'sd']` (tenant is 'tenant1', label is 'sd'),
//       // then `const [tenant, label] = parts;` results in `tenant='tenant1'`, `label='sd'`.
//       // Your rewrite `/${tenant}/${label}` would then become `/tenant1/sd`.
//       // Your example description `http://tenant1.sd.localhost:3000/` reroutes to `/${tenant}/${label}`.
//       // If you want `http://tenant1.sd.localhost:3000/` to resolve to an internal path like `/sd/tenant1`,
//       // then your rewrite should be `/${label_from_parts}/${tenant_from_parts}`.
//       // Let's adjust variable assignment for clarity if `parts` is `[tenant, label]`.

//       // Let's assume for `http://tenant1.sd.localhost:3000/`, `extractSubdomains` returns `['tenant1', 'sd']`.
//       // If `tenant1` is the actual tenant name and `sd` is a specific "label" or app type.
//       // And you want the path to be `/sd/tenant1`.
//       // Then `parts[0]` is tenant, `parts[1]` is label.
//       const tenant = parts[0];
//       const label = parts[1];
//       return NextResponse.rewrite(new URL(`/${label}/${tenant}`, request.url));
//     }

//     if (parts.length === 1) {
//       const [tenant] = parts;
//       return NextResponse.rewrite(new URL(`/${tenant}`, request.url));
//     }
//   }

//   // If not a root path or no matching subdomain parts, proceed normally.
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all paths except for:
//      * 1. /api routes
//      * 2. /_next (Next.js internals)
//      * 3. all root files inside /public (e.g. /favicon.ico, /robots.txt)
//      * 4. Files with extensions (e.g., .js, .css, .png, etc.)
//      * This `matcher` config is good and should work with the middleware logic.
//      */
//     "/((?!api|_next|[\\w-]+\\.\\w+).*)",
//   ],
// };
import { type NextRequest, NextResponse } from "next/server";
import { rootDomain } from "@/lib/utils"; // Assuming this is correctly defined

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

const IGNORED = ["/api", "/_next", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    IGNORED.some((p) => pathname.startsWith(p)) ||
    request.method !== "GET" ||
    request.headers.has("x-rewrite-from")
  ) {
    return NextResponse.next();
  }

  const parts = extractSubdomains(request);

  if (!parts || parts.length === 0) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const [tenant, label] = parts;

  if (pathname === "/dashboard" || pathname === "/settings") {
    if (label) {
      return NextResponse.rewrite(
        new URL(`/${tenant}/${label}${pathname}`, request.url)
      );
    } else {
      return NextResponse.rewrite(
        new URL(`/${tenant}${pathname}`, request.url)
      );
    }
  }

  if (parts.length === 2) {
    return NextResponse.rewrite(
      new URL(`/${tenant}/${label}${pathname}`, request.url)
    );
  }

  if (parts.length === 1) {
    return NextResponse.rewrite(new URL(`/${tenant}${pathname}`, request.url));
  }

  return NextResponse.next();
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
