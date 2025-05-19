// components/ProtectedRoute.js
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/utils/auth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const userRole = getUserRole();

      if (!token) {
        router.push("/");
        return;
      }

      if (requiredRole && userRole !== requiredRole) {
        router.push("/unauthorized");
        return;
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  return children;
};

export default ProtectedRoute;
