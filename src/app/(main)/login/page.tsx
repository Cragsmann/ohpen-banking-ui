"use client";
import { useTenant } from "@/app/providers/TenantProvider";

export default function DashboardPage() {
  const { tenant, label } = useTenant();

  return (
    <div>
      <h1>{tenant.subdomain} Dashboard</h1>
      <p>
        Viewing data for Label: <strong>{label?.name}</strong>
      </p>
      {/* Your interactive dashboard components go here */}
    </div>
  );
}
