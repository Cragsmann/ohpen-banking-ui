"use client";

import { useTenant } from "@/app/providers/TenantProvider";

export default function Dashboard() {
  const tenant = useTenant();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard for {tenant.subdomain}</h1>
      {/* <p>Business Unit: {label}</p> */}
    </div>
  );
}
