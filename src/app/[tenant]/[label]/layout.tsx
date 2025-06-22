"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { TenantProvider } from "@/app/providers/TenantProvider";

export default function LabelLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { tenant: string; label: string };
}) {
  const { tenant, label } = params;

  return (
    <TenantProvider tenant={tenant}>
      <header className="bg-white border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">
            {label.charAt(0).toUpperCase() + label.slice(1)} — {tenant}
          </h1>
          <nav className="space-x-2">
            <Link
              href={`/dashboard`}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Dashboard
            </Link>
            <Link
              href={`/settings`}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </TenantProvider>
  );
}
