import type { Metadata } from "next";
import { rootDomain } from "@/lib/utils";
import { getAllTenants } from "@/lib/redis";
import { AdminDashboard } from "./AdminDashboard";

export const metadata: Metadata = {
  title: `Admin Dashboard | ${rootDomain}`,
  description: `Manage subdomains for ${rootDomain}`,
};

export default async function AdminPage() {
  const tenants = await getAllTenants();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <AdminDashboard tenants={tenants} />
    </div>
  );
}
