"use client";
import { useEffect, useState, use } from "react";
import axios from "axios";
import { ServerUrl } from "@/app/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoutes";
const AdminTripDetails = ({ params }) => {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const tripId = use(params).tripId;

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await axios.get(`${ServerUrl}/tripPlans/viewTripPlan`, {
                    params: { _id: tripId }
                });
                setTrip(response.data.result);
            } catch (err) {
                console.error("Error fetching trip:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [tripId]);

    if (loading) return <div className="p-8">Loading trip details...</div>;
    if (!trip) return <div className="p-8">Trip not found</div>;

    return (
        <ProtectedRoute adminOnly={true}>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Trip Details: {trip.name}</h1>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Back
                        </button>
                    </div>

                    {/* Basic Info Table */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="bg-white divide-y divide-gray-200">
                                <TableRow label="Title" value={trip.title} />
                                <TableRow label="Route" value={trip.route} />
                                <TableRow label="Duration" value={trip.duration} />
                                <TableRow label="Minimum Price" value={trip.minPrice} />
                                <TableRow label="Status" value={trip.status} />
                                <TableRow label="Age Group" value={trip.ageGroup} />
                                <TableRow
                                    label="Categories"
                                    value={trip.category?.join(", ")}
                                />
                            </tbody>
                        </table>
                    </div>

                    {/* Batches Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Upcoming Batches</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transport Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Triple Sharing</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Double Sharing</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {trip.batch?.map((batch) => (
                                        batch.transports?.map((transport, i) => (
                                            <tr key={`${batch._id}-${i}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">{batch.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{transport.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{transport.costTripleSharing}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{transport.costDoubleSharing}</td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Itinerary Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {trip.fullItinerary?.map((day) => (
                                    <tr key={day._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{day.day}</td>
                                        <td className="px-6 py-4">{day.title}</td>
                                        <td className="px-6 py-4 whitespace-pre-line">{day.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Image URLs</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Banner Images */}
                                    {trip.banners && (
                                        <>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap">Web Banner</td>
                                                <td className="px-6 py-4 break-all">
                                                    <a href={trip.banners.web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {trip.banners.web}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <img
                                                        src={trip.banners.web}
                                                        alt="Web banner preview"
                                                        className="h-10 object-cover"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap">Mobile Banner</td>
                                                <td className="px-6 py-4 break-all">
                                                    <a href={trip.banners.phone} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {trip.banners.phone}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <img
                                                        src={trip.banners.phone}
                                                        alt="Mobile banner preview"
                                                        className="h-10 object-cover"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                </td>
                                            </tr>
                                        </>
                                    )}

                                    {/* Gallery Images */}
                                    {trip.images?.map((image, index) => (
                                        <tr key={`image-${index}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">Gallery Image {index + 1}</td>
                                            <td className="px-6 py-4 break-all">
                                                <a href={image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    {image}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={image}
                                                    alt={`Gallery preview ${index + 1}`}
                                                    className="h-10 object-cover"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Inclusions/Exclusions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Inclusions</h2>
                            <table className="min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {trip.inclusions?.map((item) => (
                                        <tr key={item._id}>
                                            <td className="px-6 py-4">
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-gray-600">{item.description}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Exclusions</h2>
                            <table className="min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {trip.exclusions?.map((item) => (
                                        <tr key={item._id}>
                                            <td className="px-6 py-4">
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-gray-600">{item.description}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-8">
                        {/* <Link
            href={`/admin/trips/edit/${trip._id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Trip
          </Link> */}
                        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            Delete Trip
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

// Reusable table row component
const TableRow = ({ label, value }) => (
    <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{label}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value || '-'}</td>
    </tr>
);

export default AdminTripDetails;