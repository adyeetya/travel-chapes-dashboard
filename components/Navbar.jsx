'use client'
import React, { useState, useEffect } from 'react';
import auth from '@/utils/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname(); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run auth checks on client side
    setIsAuthenticated(auth.isAuthenticated());
    setIsAdmin(auth.getAdminFromToken());
    setIsLoading(false);
  }, [pathname]);

  const handleSignOut = () => {
    auth.removeToken();
    setIsAuthenticated(false);
    setIsAdmin(false);
    router.refresh();
  };

  if (isLoading) {
    // Return a neutral version during initial render
    return (
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white shadow-md rounded-lg">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      </header>
    );
  }

  return (
    <header className="flex h-14 items-center justify-between px-4 sm:px-8 py-4 bg-white shadow-md rounded-lg">
      {/* Logo/Brand */}
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 8v5m-6-5l1.7-1.02a4 4 0 013.6 0L12 15m0 0l1.7-1.02a4 4 0 013.6 0L21 15"
          />
        </svg>
        <Link href='/' className="text-lg sm:text-xl font-semibold">Travel Dashboard</Link>
      </div>

      {/* Navigation Links - Hidden on mobile */}
      {/* <nav className="hidden sm:flex gap-6">
        <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
        <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Trips</a>
        {isAuthenticated && (
          <>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Bookings</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Profile</a>
          </>
        )}
      </nav> */}

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <Link 
            href="/auth/login" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Login
          </Link>
        ) : (
          <>
            {isAdmin && (
              <span className="hidden sm:inline text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Admin {isAdmin.email}
              </span>
            )}
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;