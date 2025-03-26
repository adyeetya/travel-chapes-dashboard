"use client";
import { useState } from "react";
import TripForm from "./components/TripForm";

const TripsPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Manage Trips</h1>

      {/* Add Trip Button */}
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        + Add New Trip
      </button>

      {/* Trip Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-4xl">
            <TripForm closeForm={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsPage;
