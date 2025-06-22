import { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { TenantProvider } from "@/app/providers/TenantProvider";
import { getTenantConfig } from "@/lib/redis";
import { notFound } from "next/navigation";

export default async function LabelLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { tenant: string; label: string };
}) {
  const { tenant, label } = await params;

  if (!tenant) {
    throw new Error("Missing tenant param");
  }

  const tenantConfig = await getTenantConfig(tenant);
  const labelConfig = tenantConfig.labels.find(
    (l) => l.name.toLowerCase() === label.toLowerCase()
  );

  if (!tenantConfig || !labelConfig) {
    notFound();
  }

  return (
    <TenantProvider tenant={tenantConfig} label={labelConfig}>
      <header className="bg-white border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">
            {labelConfig.name} — {tenantConfig.subdomain}
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
