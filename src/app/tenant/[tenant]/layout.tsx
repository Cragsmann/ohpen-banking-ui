import { getTenantConfig } from "@/lib/redis";
import { generateTenantSubdomainHref, protocol, rootDomain } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TenantProvider } from "../../providers/TenantProvider";
import { LabelDropdown } from "./LabelSelect";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const { tenant } = await params;
  const tenantConfig = await getTenantConfig(tenant);

  if (!tenantConfig) {
    notFound();
  }

  return (
    <TenantProvider tenant={tenantConfig}>
      <header className="border-b bg-background">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">{tenantConfig.subdomain}</h1>
          <div className="flex items-center gap-4">
            <LabelDropdown
              tenant={tenantConfig.subdomain}
              labels={tenantConfig.labels}
            />
            <Link
              href={generateTenantSubdomainHref(tenantConfig.subdomain)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Access Rules
            </Link>
            <Link
              href={`${protocol}://${rootDomain}/admin`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Admin{" "}
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </TenantProvider>
  );
}
