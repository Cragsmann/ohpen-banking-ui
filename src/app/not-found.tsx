"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { rootDomain } from "@/lib/utils";

export default function GlobalNotFound() {
  const params = useParams(); // Might be { tenant, label, ... }
  const pathname = usePathname(); // e.g. '/settings2'
  const tenant = params.tenant || null;
  const label = params.label || null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {tenant && label
            ? `Page "${pathname}" not found for ${label}.${tenant}.${rootDomain}`
            : `Page "${pathname}" not found`}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {tenant && label
            ? `The route you tried doesn’t exist in the ${label} view of ${tenant}.`
            : `We couldn’t find that page.`}
        </p>
        <div className="space-x-3">
          {tenant && label ? (
            <Link
              href={`/${tenant}/${label}`}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to {label} Dashboard
            </Link>
          ) : null}
          <Link
            href="/"
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
