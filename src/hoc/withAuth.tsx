"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }
    }, [user, loading, router]);

    if (loading) {
      return <p>Loading...</p>;
    }

    return user ? <Component /> : null;
  };
}
