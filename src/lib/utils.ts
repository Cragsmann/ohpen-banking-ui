import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LabelConfig } from "./types";

export const protocol =
  process.env.NODE_ENV === "production" ? "https" : "http";
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function generateLabelSubdomainHref(
  tenantSubdomain: string,
  labelName?: string
): string {
  const formattedLabelName = labelName?.toLowerCase();

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.split(":")[0];

  const baseDomain = rootDomain || "localhost:3000";

  const fullSubdomain = `${tenantSubdomain}.${formattedLabelName}`;

  return `${protocol}://${fullSubdomain}.${baseDomain}`;
}

export function generateTenantSubdomainHref(tenantSubdomain: string): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.split(":")[0];
  const baseDomain = rootDomain || "localhost:3000";
  return `${protocol}://${tenantSubdomain}.${baseDomain}`;
}

export function parseLabelsFromString(
  labelsString?: string | string[]
): LabelConfig[] {
  if (!labelsString) {
    return [];
  }

  return labelsString[0]
    .split(",")
    .filter(Boolean)
    .map((name, index) => ({
      id: index + 1,
      name: name.trim(),
    }));
}
