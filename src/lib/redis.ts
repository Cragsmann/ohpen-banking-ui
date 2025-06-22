import { Redis } from "@upstash/redis";
import { Tenant } from "./types";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function getTenantData(tenant: string): Promise<Tenant> {
  const sanitizedTenant = tenant.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const data = await redis.hgetall<Record<string, string>>(
    `tenant:${sanitizedTenant}`
  );

  if (!data || Object.keys(data).length === 0) {
    throw new Error(`Tenant "${sanitizedTenant}" not found`);
  }

  return {
    subdomain: sanitizedTenant,
    branding: {
      primaryColor: data.primaryColor || "#000000",
      secondaryColor: data.secondaryColor || "#ffffff",
    },
    accessRules: data.accessRules ? data.accessRules.split(",") : [],
    labels: data.labels ? JSON.parse(data.labels) : [],
    createdAt: data.createdAt,
  };
}

export async function getAllTenants() {
  const keys = await redis.keys("tenant:*");

  if (!keys.length) return [];

  const tenants = await Promise.all(
    keys.map(async (key) => {
      const data = await redis.hgetall<Record<string, string>>(key);

      let labels: string[] = [];
      try {
        labels = data?.labels ? JSON.parse(data?.labels) : [];
      } catch (err) {
        console.error(`Error parsing labels for ${key}:`, err);
        labels = [];
      }

      return {
        subdomain: key.replace("tenant:", ""),
        branding: {
          primaryColor: data?.primaryColor || "#000000",
          secondaryColor: data?.secondaryColor || "#ffffff",
        },
        accessRules: data?.accessRules ? data?.accessRules.split(",") : [],
        labels,
        createdAt: data?.createdAt || "",
      };
    })
  );

  return tenants;
}
