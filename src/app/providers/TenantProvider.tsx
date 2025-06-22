"use client";

import { getTenantData } from "@/lib/redis";
import { Tenant } from "@/lib/types";
import { createContext, useContext } from "react";

type TenantContextType = {
  tenant: Tenant;
};

const TenantContext = createContext<TenantContextType | null>(null);

export async function TenantProvider({
  tenant,
  children,
}: {
  tenant: string;
  children: React.ReactNode;
}) {
  const tenantData = await getTenantData(tenant);

  return (
    <TenantContext.Provider value={{ tenant: tenantData }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenant must be used inside TenantProvider");
  return context.tenant;
}
