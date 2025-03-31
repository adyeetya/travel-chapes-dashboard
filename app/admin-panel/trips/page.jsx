"use client";
import { useEffect, useState } from "react";
import TripForm from "./components/TripForm";
import Link from "next/link";
import { ServerUrl } from "@/app/config";
import axios from "axios";
import auth from "@/utils/auth";

const TripsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [planIds, setPlanIds] = useState([]);
  const [loading, setLoading] = useState({
    trips: true,
    locations: true,
    ids: true
  });
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = auth.getToken();

  useEffect(() => {
    const fetchIds = async () => {
      try {
        setLoading(prev => ({...prev, ids: true}));
        const res = await axios.get(`${ServerUrl}/tripPlans/getAllIds`);
        setPlanIds(res?.data?.result);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch plan IDs");
      } finally {
        setLoading(prev => ({...prev, ids: false}));
      }
    };
    fetchIds();
  }, []);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data } = await axios.get(
          `${ServerUrl}/tripRequirement/getHotelList`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log('data in get hotel', data)
        setHotels(data?.result || []);
      
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Failed to fetch hotels");
      }
    };


    fetchHotels();
  }, []);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(
          `${ServerUrl}/tripRequirement/getVehicalList`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log('vehicles:',response.data.result)
        setVehicles(response.data?.result);
       
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to fetch vehicles");
      }
    };
    fetchVehicle();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(prev => ({...prev, locations: true}));
        const response = await axios.get(
          `${ServerUrl}/tripRequirement/getLocationList`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLocations(response.data?.result || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to fetch locations");
      } finally {
        setLoading(prev => ({...prev, locations: false}));
      }
    };
    fetchLocations();
  }, [token]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(prev => ({...prev, trips: true}));
        const response = await axios.get(
          `${ServerUrl}/tripRequirement/getTripList`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrips(response.data?.result || []);
        setFilteredTrips(response.data?.result || []);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to fetch trips");
      } finally {
        setLoading(prev => ({...prev, trips: false}));
      }
    };
    fetchTrips();
  }, [token]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter(trip => 
        trip.locationId?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.pickup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.drop?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (trip.viaPoints?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTrips(filtered);
    }
  }, [searchTerm, trips]);

  const handleSave = async (newTrip) => {
    try {
      setLoading(prev => ({...prev, trips: true}));
      const res = await axios.post(`${ServerUrl}/tripRequirement/createTrip`, newTrip, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTrips(prev => [...prev, res.data?.result]);
      setFilteredTrips(prev => [...prev, res.data?.result]);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setError("Failed to create trip");
    } finally {
      setLoading(prev => ({...prev, trips: false}));
    }
  }

  const isLoading = loading.trips || loading.locations || loading.ids;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Trips/Batches Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Add New Trip"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search trips by location, pickup, drop or via points..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Trips Table */}
        {!isLoading && (
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
                {filteredTrips.map((trip) => (
                  <tr key={trip._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {trip.locationId?.city || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      From {trip.pickup}{" "}
                      {trip.viaPoints && `via ${trip.viaPoints}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(trip.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })} to {new Date(trip.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })} ({trip.days} days)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {trip.pricing?.car?.single
                        ? `₹${trip.pricing.car.single.toLocaleString()} (S)`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {trip.pricing?.bus?.single
                        ? `₹${trip.pricing.bus.single.toLocaleString()} (S)`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin-panel/trips/${trip._id}?location=${trip.slug}`}
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
        )}

        {/* Empty State */}
        {!isLoading && filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? "No matching trips found." : "No trips available. Add a new trip to get started."}
            </p>
          </div>
        )}

        {/* Trip Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
              <TripForm
                closeForm={() => setShowForm(false)}
                onSave={handleSave}
                planIds={planIds}
                locations={locations}
                vehicles={vehicles}
                hotels={hotels}
                isLoading={loading.trips}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;