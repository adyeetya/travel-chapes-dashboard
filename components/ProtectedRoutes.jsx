"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import auth from "@/utils/auth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = auth.getToken();
    const user = auth.getAdminFromToken();
// console.log('user:>',user)
    if (!token || !auth.isAuthenticated()) {
      router.replace("/auth/login");
      return;
    }

    if (adminOnly && (!user || user.adminType !== "ADMIN")) {
      router.replace("/403"); // Redirect to forbidden page if not admin
      return;
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
