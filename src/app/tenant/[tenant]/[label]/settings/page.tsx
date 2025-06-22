"use client";

import { useTenant } from "@/app/providers/TenantProvider";

export default function Dashboard() {
  const { tenant, label } = useTenant();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Settings for: {tenant.subdomain}</h1>
      <p>
        Label: <strong>{label?.name}</strong>
      </p>
    </div>
  );
}
