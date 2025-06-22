"use client";

import { protocol, rootDomain } from "@/lib/utils";
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page not found
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We couldn’t find that page.
        </p>
        <div className="space-x-3 flex justify-center">
          <Link
            href={`${protocol}://${rootDomain}/admin`}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
          >
            Go to Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
}
