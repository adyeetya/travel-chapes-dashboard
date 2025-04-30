"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-6">Access Forbidden</h2>
        <p className="text-gray-500 mb-8">
          You don't have permission to access this page.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
} 