"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { ServerUrl } from "@/app/config";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoutes";

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredTrips, setFilteredTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.post(`${ServerUrl}/tripPlans/getAllTripPlans`);
        // console.log('res',response.data)
        setTrips(response.data?.result?.docs || []);
        // setFilteredTrips(response.data?.result?.docs || []);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to fetch trips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);



  const filteredTrips = useMemo(() => {
    if (!searchTerm) return trips;
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    return trips.filter(trip => {
      // Check if title matches
      const titleMatch = trip.title?.toLowerCase().includes(lowerCaseSearchTerm);
      
      // Check if any category matches
      const categoryMatch = trip.category?.some(cat => 
        cat.toLowerCase().includes(lowerCaseSearchTerm)
      );
      
      return titleMatch || categoryMatch;
    });
  }, [trips, searchTerm]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedAdminTypes={['ADMIN', 'SALES']}>
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">All Trips</h1>
          <Link
            href="/trips/add-trip"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add New Trip Content
          </Link>
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
              placeholder="Search trips by name, title, route or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div key={trip._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 rounded-lg">
                <img
                  src={trip.banners?.web || trip.images[0] || "/images/default-trip.webp"}
                  alt={trip.title}
                  className="object-contain w-full h-full rounded-lg"
                  
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{trip.name}</h2>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {trip.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">{trip.title}</h3>

                <div className="mb-3">
                  <p className="text-gray-600">{trip.route}</p>
                  <p className="text-gray-600">{trip.duration}</p>
                  <p className="text-gray-800 font-medium">From {trip.minPrice}</p>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {trip.category?.map((cat) => (
                    <span key={cat} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-1">Upcoming Batches:</h4>
                  <ul className="text-sm text-gray-600">
                    {trip.batch?.slice(0, 2).map((batch) => (
                      <li key={batch._id} className="flex justify-between">
                        <span>{batch.date}</span>
                        <span>{batch.transports[0]?.costTripleSharing}</span>
                      </li>
                    ))}
                  </ul>
                </div> */}

                <Link
                  href={`/trips/${trip._id}?tripName=${trip.slug}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? "No matching trips found." : "No trips available."}
            </p>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default TripsPage;