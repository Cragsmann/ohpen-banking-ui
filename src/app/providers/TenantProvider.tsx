"use client";
import { createContext, ReactNode, useContext } from "react";

type TenantData = {
  name: string;
  themeColor: string;
  logoUrl: string;
};

const TenantContext = createContext<TenantData | undefined>(undefined);

export const TenantProvider = ({
  tenant,
  children,
}: {
  tenant: TenantData;
  children: ReactNode;
}) => {
  return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
};
