"use server";

import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";

export async function createTenantAction(formData: FormData) {
  const subdomain = (formData.get("subdomain") as string)?.trim().toLowerCase();
  const primaryColor = (formData.get("primaryColor") as string)?.trim();
  const secondaryColor = (formData.get("secondaryColor") as string)?.trim();
  const labels = formData
    .getAll("labels")
    .map((l) => l.toString().trim())
    .filter(Boolean);
  const accessRules =
    formData.get("accessRules")?.toString().split(",").filter(Boolean) || [];

  if (!subdomain) throw new Error("Subdomain is required");
  if (!/^[a-z0-9-]+$/.test(subdomain))
    throw new Error("Subdomain must be lowercase letters, numbers, or hyphens");

  const key = `tenant:${subdomain}`;
  if (await redis.exists(key))
    throw new Error(`Tenant "${subdomain}" already exists`);

  await redis.hset(key, {
    primaryColor,
    secondaryColor,
    labels: JSON.stringify(labels),
    accessRules: accessRules.join(","),
    createdAt: Date.now().toString(),
  });

  redirect(`/admin`);
}
