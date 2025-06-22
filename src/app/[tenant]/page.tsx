"use client";
import { useTenant } from "@/app/providers/TenantProvider";

export default function DashboardPage() {
  const { tenant } = useTenant();
  return (
    <div>
      <h1 style={{ color: tenant.theme.primaryColor }}>
        {tenant.subdomain} Tanant home page
      </h1>
    </div>
  );
}
