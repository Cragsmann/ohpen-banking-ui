"use server";

import { redis } from "@/lib/redis";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTenantAction(formData: FormData) {
  const subdomain = (formData.get("subdomain") as string)?.trim().toLowerCase();
  const labels = formData
    .getAll("labels")
    .map((l) => l.toString().trim())
    .filter(Boolean);
  const accessRules =
    formData.get("accessRules")?.toString().split(",").filter(Boolean) || [];

  const key = `tenant:${subdomain}`;

  if (await redis.exists(key))
    throw new Error(`Tenant "${subdomain}" already exists`);

  await redis.hset(key, {
    labels: JSON.stringify(labels),
    accessRules: accessRules.join(","),
    createdAt: Date.now().toString(),
  });

  redirect(`/admin`);
}

export async function deleteTenantAction(formData: FormData): Promise<void> {
  const subdomain = formData.get("subdomain")?.toString();

  if (!subdomain) {
    throw new Error("Subdomain is required");
  }

  await redis.del(`tenant:${subdomain}`);
  revalidatePath("/admin");
}
