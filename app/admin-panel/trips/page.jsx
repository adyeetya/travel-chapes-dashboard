"use client";
import { useState } from "react";

import TripForm from "./components/TripForm";
import Link from "next/link";

// Dummy data structure matching your trip schema
const dummyTrips = [
  {
    id: "1",
    location: "Goa",
    pickup: "Mumbai",
    viaPoints: ["Pune"],
    drop: "Goa Airport",
    startDate: "2023-12-15",
    endDate: "2023-12-20",
    days: 5,
    itinerary: ["Day 1 content", "Day 2 content"],
    vehicles: ["Car"],
    stays: ["Hotel A"],
    meals: ["Breakfast", "Lunch"],
    pricing: { 
      car: { price: 15000 }, 
      bus: {}, 
      gst: 18 
    }
  }
];

const TripsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [trips, setTrips] = useState(dummyTrips);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Manage Trips</h1>

      {/* Add Trip Button */}
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-6"
      >
        + Add New Trip
      </button>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map(trip => (
          <Link 
            key={trip.id} 
            href={`/admin-panel/trips/${trip.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{trip.location} Trip</h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Dates:</span> {trip.startDate} to {trip.endDate} ({trip.days} days)
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Route:</span> {trip.pickup} → {trip.viaPoints.join(" → ")} → {trip.drop}
              </p>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Price:</span> ₹{trip.pricing.car.price?.toLocaleString() || '0'} (GST: {trip.pricing.gst}%)
              </p>
              <div className="flex justify-end">
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                  View Details
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Trip Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <TripForm 
              closeForm={() => setShowForm(false)} 
              onSave={(newTrip) => {
                setTrips(prev => [...prev, { ...newTrip, id: `trip_${Date.now()}` }]);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsPage;