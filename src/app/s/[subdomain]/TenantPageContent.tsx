"use client"; 

import { useTenant } from "@/app/providers/TenantProvider";
import Link from "next/link";
import { protocol, rootDomain } from "@/lib/utils";

export default function TenantPageContent() {
  const tenant = useTenant();

  return (
    <div
      className="flex min-h-screen flex-col p-4"
      style={{ backgroundColor: tenant.themeColor + "20" }} // light transparent bg
    >
      <div className="absolute top-4 right-4">
        <Link
          href={`${protocol}://${rootDomain}`}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {rootDomain}
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <img
            src={tenant.logoUrl}
            alt={`${tenant.name} logo`}
            className="mx-auto mb-4 h-12"
          />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welcome to {tenant.name}.{rootDomain}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            This is your custom subdomain page
          </p>
        </div>
      </div>
    </div>
  );
}
