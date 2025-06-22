import Link from "next/link";
import { rootDomain } from "@/lib/utils";
import { CreateTenantForm } from "./SubdomainForm";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <Link href="/admin" className="text-sm  transition-colors">
          Admin
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight ">{rootDomain}</h1>
        </div>

        <div className="mt-8  shadow-md rounded-lg p-6">
          <CreateTenantForm />
        </div>
      </div>
    </div>
  );
}
