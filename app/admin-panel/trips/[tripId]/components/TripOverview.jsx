"use client";
import { useState, useEffect } from "react";

export const TripOverview = ({ trip, loading, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [tempTrip, setTempTrip] = useState(trip);

  // Update tempTrip when trip prop changes
  useEffect(() => {
    setTempTrip(trip);
  }, [trip]);

  const handleChange = (field, value) => {
    setTempTrip(prev => ({ ...prev, [field]: value }));
  };

  const handlePricingChange = (vehicle, type, value) => {
    setTempTrip(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [vehicle.toLowerCase()]: {
          ...prev.pricing?.[vehicle.toLowerCase()] || {},
          [type]: Number(value),
        },
      },
    }));
  };

  const handleGSTChange = (value) => {
    setTempTrip(prev => ({
      ...prev,
      gst: Number(value),
    }));
  };

  const handleItineraryChange = (index, value) => {
    const updatedItinerary = [...tempTrip.itinerary];
    updatedItinerary[index] = value;
    setTempTrip(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  const handleSave = () => {
    onSave(tempTrip);
    setEditMode(false);
  };

  // Helper to get vehicle types from pricing object
  const getVehicleTypes = () => {
    return Object.keys(tempTrip.pricing || {});
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Trip Overview
          <span className="ml-2 text-sm font-normal text-gray-500">
           {trip.slug} | (ID: {trip._id})
          </span>
        </h2>
        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            editMode
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          disabled={loading}
        >
          {editMode
            ? loading
              ? "Saving..."
              : "Save Changes"
            : "Edit Trip"}
        </button>
      </div>

      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Trip Info */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Dates</h3>
            {editMode ? (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={tempTrip.startDate?.split('T')[0] || ''}
                  onChange={(e) => handleChange("startDate", `${e.target.value}T00:00:00.000Z`)}
                  className="p-2 border rounded-md"
                />
                <input
                  type="date"
                  value={tempTrip.endDate?.split('T')[0] || ''}
                  onChange={(e) => handleChange("endDate", `${e.target.value}T00:00:00.000Z`)}
                  className="p-2 border rounded-md"
                />
              </div>
            ) : (
              <p className="text-gray-900">
                {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()} ({trip.days} days)
              </p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Route</h3>
            {editMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={tempTrip.pickup || ''}
                  onChange={(e) => handleChange("pickup", e.target.value)}
                  placeholder="Pickup location"
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  value={tempTrip.viaPoints || ''}
                  onChange={(e) => handleChange("viaPoints", e.target.value)}
                  placeholder="Via points"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ) : (
              <p className="text-gray-900">
                {trip.pickup} → {trip.viaPoints}
              </p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Itinerary</h3>
            {editMode ? (
              <div className="space-y-2">
                {tempTrip.itinerary?.map((day, index) => (
                  <textarea
                    key={index}
                    value={day || ''}
                    onChange={(e) => handleItineraryChange(index, e.target.value)}
                    placeholder={`Day ${index + 1}`}
                    className="w-full p-2 border rounded-md"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {trip.itinerary?.map((day, index) => (
                  <div key={index} className="flex gap-4 items-center">
                  {/* <div key={index} className="prose" dangerouslySetInnerHTML={{ __html: day }} /> */}
                 <span className="text-xs text-gray-400">{index+1}.</span> <p>{day}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Inclusions</h3>
            {editMode ? (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Meals
                  </label>
                  <input
                    type="text"
                    value={tempTrip.meals?.join(", ") || ''}
                    onChange={(e) =>
                      handleChange(
                        "meals",
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-gray-900">
                  <span className="font-medium">Meals:</span>{" "}
                  {trip.meals?.join(", ") || 'None'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Pricing */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Pricing</h3>
          {editMode ? (
            <div className="space-y-4">
              {getVehicleTypes().map((vehicle) => (
                <div key={vehicle}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)} Prices (₹)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["single", "double", "triple"].map((type) => (
                      <input
                        key={type}
                        placeholder={type.charAt(0).toUpperCase() + type.slice(1)}
                        value={
                          tempTrip.pricing?.[vehicle]?.[type] || ""
                        }
                        onChange={(e) =>
                          handlePricingChange(
                            vehicle,
                            type,
                            e.target.value
                          )
                        }
                        className="p-2 border rounded-md"
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  GST (%)
                </label>
                <input
                  value={tempTrip.gst || ''}
                  onChange={(e) => handleGSTChange(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {getVehicleTypes().map((vehicle) => (
                <div key={vehicle}>
                  <span className="font-medium">{vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}:</span>
                  <div className="ml-2 text-sm">
                    {["single", "double", "triple"].map((type, i, arr) => (
                      <span key={type}>
                        <span>
                          {type.charAt(0).toUpperCase() + type.slice(1)}: ₹
                          {trip.pricing?.[vehicle]?.[type]?.toLocaleString() || "N/A"}
                        </span>
                        {i < arr.length - 1 && <span className="mx-2">|</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p>
                <span className="font-medium">GST:</span> {trip.gst}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};