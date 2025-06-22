"use client";

import { LabelConfig, TenantConfig } from "@/lib/types";
import { createContext, useContext } from "react";

type TenantContextType = {
  tenant: TenantConfig;
  label?: LabelConfig;
};

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({
  tenant,
  label,
  children,
}: {
  tenant: TenantConfig;
  label?: LabelConfig;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider value={{ tenant, label }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenant must be used inside TenantProvider");
  return context;
}
