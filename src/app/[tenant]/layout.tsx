import { getTenantConfig } from "@/lib/redis";
import { notFound } from "next/navigation";
import { TenantProvider } from "../providers/TenantProvider";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const { tenant } = await params;
  const tenantConfig = await getTenantConfig(tenant);

  if (!tenant) {
    notFound();
  }

  return <TenantProvider tenant={tenantConfig}>{children}</TenantProvider>;
}
