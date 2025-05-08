"use client";
import { useEffect, useState } from "react";
import TripForm from "./components/TripForm";
import Link from "next/link";
import { ServerUrl } from "@/app/config";
import axios from "axios";
import auth from "@/utils/auth";
import ProtectedRoute from "@/components/ProtectedRoutes";
const TripsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [options, setOptions] = useState(false);
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [planIds, setPlanIds] = useState([]);
  const [loading, setLoading] = useState({
    trips: true,
    locations: true,
    ids: true,
  });
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = auth.getToken();

  const handleApiError = (error, context) => {
    if (error.code === "ERR_NETWORK") {
      setError(`Network error while ${context}. Please check your internet connection.`);
    } else if (error.response) {
      // Server responded with error
      const message = error.response.data?.responseMessage || error.response.statusText;
      setError(`Error ${context}: ${message} (Status: ${error.response.status})`);
    } else if (error.request) {
      // Request made but no response
      setError(`No response received while ${context}. Please try again.`);
    } else {
      // Other errors
      setError(`Unexpected error while ${context}: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchIds = async () => {
      try {
        console.log('Loading IDs')
        setLoading((prev) => ({ ...prev, ids: true }));
        let allIds = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore) {
          console.log('Loading IDs222')
          const res = await axios.post(`${ServerUrl}/tripPlans/getAllIds`, 
            {
              page: currentPage,
              limit: 10 // Fetch 10 at a time to be efficient
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log('res:', res)
          if (!res?.data?.result?.docs) {
            break;
          }

          const newDocs = res.data.result.docs;
          allIds = [...allIds, ...newDocs.map(doc => doc.slug)];
          
          // Check if we've loaded all pages
          hasMore = currentPage < res.data.result.totalPages;
          currentPage++;
        }

        setPlanIds(allIds);
      } catch (error) {
        handleApiError(error, "fetching plan IDs");
      } finally {
        setLoading((prev) => ({ ...prev, ids: false }));
      }
    };
    fetchIds();
  }, [token]);

  // fetch hotels
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
        handleApiError(err, "fetching hotels");
      }
    };

    fetchHotels();
  }, []);

  // fetcvh vehicles
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
        handleApiError(err, "fetching vehicles");
      }
    };
    fetchVehicle();
  }, []);

  // fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading((prev) => ({ ...prev, locations: true }));
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
        handleApiError(err, "fetching locations");
      } finally {
        setLoading((prev) => ({ ...prev, locations: false }));
      }
    };
    fetchLocations();
  }, [token]);

  // fetch trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading((prev) => ({ ...prev, trips: true }));
        const response = await axios.get(
          `${ServerUrl}/tripRequirement/getTripList`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("trips>", response.data?.result);

        setTrips(response.data?.result || []);
        setFilteredTrips(response.data?.result || []);
      } catch (err) {
        handleApiError(err, "fetching trips");
      } finally {
        setLoading((prev) => ({ ...prev, trips: false }));
      }
    };
    fetchTrips();
  }, [token]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter((trip) => {
        const city = trip.locationId?.city?.toLowerCase() || "";
        const pickup = trip.pickup?.toLowerCase() || "";
        const drop = trip.drop?.toLowerCase() || "";
        const viaPoints = trip.viaPoints?.toLowerCase() || "";

        const startDate = trip.startDate
          ? new Date(trip.startDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).toLowerCase() // e.g., "31 Mar 2025"
          : "";

        const search = searchTerm.toLowerCase();

        return (
          city.includes(search) ||
          pickup.includes(search) ||
          drop.includes(search) ||
          viaPoints.includes(search) ||
          startDate.includes(search)
        );
      });

      setFilteredTrips(filtered);
    }
  }, [searchTerm, trips]);


  const handleSave = async (newTrip) => {
    try {
      setLoading((prev) => ({ ...prev, trips: true }));
      const res = await axios.post(
        `${ServerUrl}/tripRequirement/createTrip`,
        newTrip,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrips((prev) => [...prev, res.data?.result]);
      setFilteredTrips((prev) => [...prev, res.data?.result]);
      setShowForm(false);
      setError("");
    } catch (error) {
      handleApiError(error, "creating trip");
    } finally {
      setLoading((prev) => ({ ...prev, trips: false }));
    }
  };

  const isLoading = loading.trips || loading.locations || loading.ids;

  return (
    <ProtectedRoute allowedAdminTypes={['ADMIN', 'SALES']}>
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Trips/Batches Management
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Add New Trip"}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex justify-between items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search trips by start date, location, pickup, drop or via points..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>

            {/* Options Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOptions(!options)}
                className="px-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Options
              </button>

              {options && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                  <div className="py-1">
                    <button
                      onClick={() => setOptions(false)}
                      className="absolute top-1 right-1 p-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                    <Link
                      href="/admin-panel/locations"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                      onClick={() => setOptions(false)}
                    >
                      Locations
                    </Link>
                    <Link
                      href="/admin-panel/vehicles"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                      onClick={() => setOptions(false)}
                    >
                      Vehicles
                    </Link>
                    <Link
                      href="/admin-panel/hotels"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                      onClick={() => setOptions(false)}
                    >
                      Hotels
                    </Link>
                  </div>
                </div>
              )}
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
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
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
                          Lowest Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Customers
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
                            {new Date(trip.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            to{" "}
                            {new Date(trip.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            ({trip.days} days)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {(() => {
                              if (!trip.pricing || Object.keys(trip.pricing).length === 0) return "N/A";
                              
                              const allPrices = Object.values(trip.pricing)
                                .flatMap(option => Object.values(option))
                                .filter(price => typeof price === "number");

                              if (allPrices.length === 0) return "N/A";

                              const minPrice = Math.min(...allPrices);
                              return `₹${minPrice.toLocaleString()}`;
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {trip.customerCount || 0}
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
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredTrips.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm
                  ? "No matching trips found."
                  : "No trips available. Add a new trip to get started."}
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
    </ProtectedRoute>
  );
};

export default TripsPage;
