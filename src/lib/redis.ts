import { Redis } from "@upstash/redis";
import { TenantConfig } from "./types";
import { parseLabelsFromString } from "./utils";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function getTenantConfig(
  tenant: string
): Promise<TenantConfig | null> {
  const sanitizedTenant = tenant.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const data = await redis.hgetall<Record<string, string>>(
    `tenant:${sanitizedTenant}`
  );

  if (!data || Object.keys(data).length === 0) return null;

  return {
    id: Number(data.id || 0),
    subdomain: sanitizedTenant,
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
        accessRules: data.accessRules ? data.accessRules.split(",") : [],
        labels: parseLabelsFromString(data.labels) || [],
        createdAt: data.createdAt || "",
      };
    })
  );
}
