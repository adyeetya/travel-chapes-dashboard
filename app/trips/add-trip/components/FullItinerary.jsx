"use client";
import { useState } from "react";
import ItineraryItem from "./ItineraryItem";

const FullItinerary = ({ tripPlan, setTripPlan }) => {
  // Update description for a specific itinerary item
  const updateDescription = (index, html) => {
    setTripPlan((prev) => {
      const updatedArray = [...prev.fullItinerary];
      updatedArray[index].description = html;
      return { ...prev, fullItinerary: updatedArray };
    });
  };

  const handleArrayChange = (e, index) => {
    const { name, value } = e.target;
    setTripPlan((prev) => {
      const updatedArray = [...prev.fullItinerary];
      updatedArray[index][name] = value;
      return { ...prev, fullItinerary: updatedArray };
    });
  };

  const addItem = () => {
    setTripPlan((prev) => ({
      ...prev,
      fullItinerary: [...prev.fullItinerary, { day: "", title: "", description: "" }],
    }));
  };

  const removeItem = (index) => {
    setTripPlan((prev) => {
      const updatedArray = prev.fullItinerary.filter((_, i) => i !== index);
      return { ...prev, fullItinerary: updatedArray };
    });
  };

  return (
    <section className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Full Itinerary</h2>
      {tripPlan.fullItinerary.map((item, index) => (
        <div key={index} className="space-y-4 mb-4">
          <input
            type="text"
            name="day"
            value={item.day}
            onChange={(e) => handleArrayChange(e, index)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Day"
          />
          <input
            type="text"
            name="title"
            value={item.title}
            onChange={(e) => handleArrayChange(e, index)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Title"
          />
          <ItineraryItem item={item} index={index} updateDescription={updateDescription} />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
      >
        + Add Full Itinerary
      </button>
    </section>
  );
};

export default FullItinerary;
