'use server';

import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';

export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;
  const color = formData.get('color') as string;
  const logoUrl = formData.get('logoUrl') as string | null;

  if (!subdomain || !color) {
    return { success: false, error: 'Subdomain and color are required' };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      color,
      logoUrl: logoUrl || undefined,
      success: false,
      error:
        'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.',
    };
  }

  const subdomainAlreadyExists = await redis.get(`subdomain:${sanitizedSubdomain}`);
  if (subdomainAlreadyExists) {
    return {
      subdomain,
      color,
      logoUrl: logoUrl || undefined,
      success: false,
      error: 'This subdomain is already taken',
    };
  }

  // Save data in Redis (logoUrl optional)
  await redis.set(`subdomain:${sanitizedSubdomain}`, JSON.stringify({
    color,
    logoUrl: logoUrl || null,
    createdAt: Date.now(),
  }));

  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`);
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain');
  await redis.del(`subdomain:${subdomain}`);
  revalidatePath('/admin');
  return { success: 'Domain deleted successfully' };
}
