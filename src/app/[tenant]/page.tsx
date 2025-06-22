"use client";
import { useTenant } from "@/app/providers/TenantProvider";

export default function DashboardPage() {
  const { tenant } = useTenant();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-semibold text-primary">
        Main Page Tenant without label: {tenant.subdomain}
      </h1>

      <div>
        <h2 className="text-lg font-medium text-muted-foreground mb-2">
          Access Rules
        </h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {tenant.accessRules.length > 0 ? (
            tenant.accessRules.map((rule) => (
              <li key={rule} className="text-foreground capitalize">
                {rule.replace(/-/g, " ")}
              </li>
            ))
          ) : (
            <li className="italic text-gray-400">No access rules defined.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
