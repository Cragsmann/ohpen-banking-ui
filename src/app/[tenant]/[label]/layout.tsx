import { TenantProvider } from "@/app/providers/TenantProvider";
import { getTenantConfig } from "@/lib/redis";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

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
  const labelConfig = tenantConfig.labels?.find(
    (l) => l.name.toLowerCase() === label?.toLowerCase()
  );

  if (!tenantConfig || !labelConfig) {
    notFound();
  }

  return (
    <TenantProvider tenant={tenantConfig} label={labelConfig}>
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">{labelConfig.name}</h1>
          <nav className="space-x-2">
            <Link
              href={`/`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href={`/settings`}
              className="text-sm text-muted-foreground hover:text-foreground"
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
