"use client";

import { useAuth } from "../providers/AuthProvider";
import AdminPage from "./admin/page";
import LoginPage from "./login/page";

export default function LandingPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return user ? <AdminPage /> : <LoginPage />;
}
