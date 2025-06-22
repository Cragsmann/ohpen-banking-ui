"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/admin");
    }
  }, [user, isLoading, router]);

  const handleLogin = () => {
    const mockUser = {
      id: "mock1",
      name: "Guest User",
      email: "guest@example.com",
    };
    login(mockUser);
  };

  if (isLoading || user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className=" p-8 rounded shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">Mock Login</h1>
        <Button
          onClick={handleLogin}
          className="font-bold py-2 px-4 rounded w-full cursor-pointer"
        >
          Login as Guest
        </Button>
      </div>
    </div>
  );
}
