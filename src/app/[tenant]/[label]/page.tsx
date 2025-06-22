"use client";
import { useTenant } from "@/app/providers/TenantProvider";

export default function DashboardPage() {
  const { tenant, label } = useTenant();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        Dashboard for tenant: {tenant.subdomain}
      </h1>
      <p>
        Label: <strong>{label?.name}</strong>
      </p>
    </div>
  );
}
