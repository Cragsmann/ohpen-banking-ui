// SubdomainPage.tsx (server component)

import { TenantProvider } from "@/app/providers/TenantProvider";
import { notFound } from "next/navigation";
import { getSubdomainData } from "@/lib/subdomains";
import TenantPageContent from "./TenantPageContent";

export default async function SubdomainPage({
  params,
}: {
  params: { subdomain: string };
}) {
  const { subdomain } = params;
  const subdomainData = await getSubdomainData(subdomain);

  if (!subdomainData) notFound();

  const tenant = {
    name: subdomain,
    themeColor: subdomainData.color || "#fff", 
    logoUrl: subdomainData.logoUrl || "/default-logo.png",
  };

  return (
    <TenantProvider tenant={tenant}>
      <TenantPageContent />
    </TenantProvider>
  );
}
