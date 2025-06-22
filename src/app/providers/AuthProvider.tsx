"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

type User = { id: string; name: string; email: string } | null;

interface AuthContextType {
  user: User;
  login: (mockUser: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("mockUser");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        if (
          parsedUser &&
          typeof parsedUser === "object" &&
          parsedUser.id &&
          parsedUser.name
        ) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("mockUser"); // Clear malformed data
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("mockUser");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((mockUser: User) => {
    if (mockUser) {
      localStorage.setItem("mockUser", JSON.stringify(mockUser));
      setUser(mockUser);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("mockUser");
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
