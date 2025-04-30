"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import auth from "@/utils/auth";

const ProtectedRoute = ({ children, allowedAdminTypes = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = auth.getToken();
    const user = auth.getAdminFromToken();
    // console.log('User data:', user);

    // Check if user is authenticated
    if (!token || !auth.isAuthenticated()) {
      console.log('No token or not authenticated');
      router.replace("/auth/login");
      return;
    }

    // If no specific admin types are required, allow access
    if (allowedAdminTypes.length === 0) {
      console.log('No admin type restrictions');
      setIsLoading(false);
      return;
    }

    // Check if user has required admin type
    if (!user || !user.adminType || !allowedAdminTypes.includes(user.adminType)) {
      console.log('User does not have required admin access');
      router.replace("/403"); // Redirect to forbidden page
      return;
    }

    // console.log('Access granted for admin type:', user.adminType);
    setIsLoading(false);
  }, [allowedAdminTypes, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
