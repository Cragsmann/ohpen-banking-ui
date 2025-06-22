"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteSubdomainAction } from "@/lib/actions";
import { TenantConfig } from "@/lib/types";
import { generateLabelSubdomainHref } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";

function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Admin panel for Tenant Management</h1>
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add tenant
          </Button>
        </Link>
      </div>
    </div>
  );
}

function TenantGrid({ tenants }: { tenants: TenantConfig[] }) {
  if (tenants.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No tenants have been created yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tenants.map((tenant) => (
        <Card key={tenant.subdomain}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{tenant.subdomain}</CardTitle>
              <form action={deleteSubdomainAction}>
                <input
                  type="hidden"
                  name="subdomain"
                  value={tenant.subdomain}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="submit"
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-gray-500">
              Created: {new Date(tenant.createdAt).toLocaleDateString()}
            </div>
            <div className="flex flex-col gap-1">
              {tenant.labels.length > 0 ? (
                tenant.labels.map((label) => (
                  <Link
                    key={label.id}
                    href={generateLabelSubdomainHref(
                      tenant.subdomain,
                      label.name
                    )}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    {label.name} →
                  </Link>
                ))
              ) : (
                <span className="text-xs text-gray-400">No labels defined</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AdminDashboard({ tenants }: { tenants: TenantConfig[] }) {
  return (
    <div className="space-y-6 relative p-4 md:p-8">
      <DashboardHeader />
      <TenantGrid tenants={tenants} />
    </div>
  );
}
