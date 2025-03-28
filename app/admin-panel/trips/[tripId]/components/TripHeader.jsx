"use client";
import { useRouter } from "next/navigation";

export const TripHeader = ({ trip, onBack }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Trips
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Trip Management Dashboard
        </h1>
        <div className="w-24"></div>
      </div>
    </header>
  );
};