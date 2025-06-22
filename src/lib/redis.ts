import { Redis } from "@upstash/redis";
import { TenantConfig, LabelConfig } from "./types";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function getTenantConfig(tenant: string): Promise<TenantConfig> {
  const sanitizedTenant = tenant.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const data = await redis.hgetall<Record<string, string>>(
    `tenant:${sanitizedTenant}`
  );

  if (!data || Object.keys(data).length === 0)
    throw new Error(`Tenant "${sanitizedTenant}" not found`);

  return {
    id: Number(data.id || 0),
    subdomain: sanitizedTenant,
    theme: {
      primaryColor: data.primaryColor || "#000000",
      secondaryColor: data.secondaryColor || "#ffffff",
    },
    accessRules: data.accessRules ? data.accessRules.split(",") : [],
    labels: parseLabelsFromString(data.labels) || [],
    createdAt: data.createdAt || "",
  };
}

export async function getAllTenants(): Promise<TenantConfig[]> {
  const keys = await redis.keys("tenant:*");
  if (!keys.length) return [];

  return Promise.all(
    keys.map(async (key) => {
      const data = await redis.hgetall<Record<string, string>>(key);
      if (!data) {
        throw new Error("Error getting tenant data");
      }

      return {
        id: Number(data.id || 0),
        subdomain: key.replace("tenant:", ""),
        theme: {
          primaryColor: data.primaryColor || "#000000",
          secondaryColor: data.secondaryColor || "#ffffff",
        },
        accessRules: data.accessRules ? data.accessRules.split(",") : [],
        labels: parseLabelsFromString(data.labels) || [],
        createdAt: data.createdAt || "",
      };
    })
  );
}

function parseLabelsFromString(
  labelsString?: string | string[]
): LabelConfig[] {
  if (!labelsString) {
    return [];
  }

  return labelsString[0]
    .split(",")
    .filter(Boolean)
    .map((name, index) => ({
      id: index + 1, // Or a more robust ID generation
      name: name.trim(),
    }));
}
