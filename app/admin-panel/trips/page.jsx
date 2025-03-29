"use client";
import { useEffect, useState } from "react";
import TripForm from "./components/TripForm";
import Link from "next/link";
import { ServerUrl } from "@/app/config";
import axios from "axios";
const dummyTrips = [
  {
    id: "1",
    location: "Golden Triangle",
    pickup: "Delhi",
    viaPoints: ["Agra", "Jaipur"],
    drop: "Delhi",
    startDate: "2025-04-10",
    endDate: "2025-04-15",
    days: 6,
    vehicles: ["Car", "Bus"],
    stays: ["Hotel Taj", "Jaipur Palace", "Delhi Grand"],
    meals: ["Breakfast", "Lunch", "Dinner"],
    pricing: {
      car: {
        single: 25000,
        double: 22000,
        triple: 20000,
      },
      bus: {
        single: 18000,
        double: 16000,
        triple: 14000,
      },
      gst: 18,
    },
  },
  {
    id: "2",
    location: "Himalayan Adventure",
    pickup: "Delhi",
    viaPoints: ["Shimla", "Manali"],
    drop: "Chandigarh",
    startDate: "2025-05-01",
    endDate: "2025-05-10",
    days: 10,
    vehicles: ["Car"],
    stays: ["Shimla Heights", "Manali Resort", "Snow Valley"],
    meals: ["Breakfast", "Dinner"],
    pricing: {
      car: {
        single: 35000,
        double: 32000,
        triple: 30000,
      },
      bus: {},
      gst: 18,
    },
  },
  {
    id: "3",
    location: "Goa Beach Tour",
    pickup: "Mumbai",
    viaPoints: ["Pune"],
    drop: "Goa Airport",
    startDate: "2025-06-15",
    endDate: "2025-06-20",
    days: 6,
    vehicles: ["Bus"],
    stays: ["Beachside Resort", "Goa Paradise"],
    meals: ["Breakfast", "Lunch", "Snacks"],
    pricing: {
      car: {},
      bus: {
        single: 15000,
        double: 13000,
        triple: 11000,
      },
      gst: 18,
    },
  },
];

const TripsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [trips, setTrips] = useState(dummyTrips);
  const [planIds, setPlanIds] = useState([]);

  useEffect(() => {
    const fetchIds = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/tripPlans/getAllIds`);
        console.log('results',res?.data?.result);
        setPlanIds(res?.data?.result);
      } catch (error) {
        console.error(error)
      }
     
    };

    fetchIds()
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Trips</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add New Trip
          </button>
        </div>

        {/* Trips Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Price (Car)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Price (Bus)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {trip.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {trip.pickup} to {trip.drop}{" "}
                    {trip.viaPoints.length > 0 &&
                      `via ${trip.viaPoints.join(", ")}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {trip.startDate} to {trip.endDate} ({trip.days} days)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {trip.pricing.car.single
                      ? `₹${trip.pricing.car.single.toLocaleString()} (S)`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {trip.pricing.bus.single
                      ? `₹${trip.pricing.bus.single.toLocaleString()} (S)`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin-panel/trips/${trip.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {trips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No trips available. Add a new trip to get started.
            </p>
          </div>
        )}

        {/* Trip Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Trip
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <TripForm
                closeForm={() => setShowForm(false)}
                onSave={(newTrip) => {
                  setTrips((prev) => [
                    ...prev,
                    { ...newTrip, id: `trip_${Date.now()}` },
                  ]);
                  setShowForm(false);
                }}
                planIds={planIds}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;
