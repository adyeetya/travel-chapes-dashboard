"use client";
import { useState } from "react";

const dummyHotels = [
  { id: 1, name: "Grand Hotel", address: "123 Main St", location: "New York", rating: 5, contact: "123-456-7890" },
  { id: 2, name: "Beach Resort", address: "456 Ocean Ave", location: "Los Angeles", rating: 4, contact: "987-654-3210" },
];

const HotelsPage = () => {
  const [hotels, setHotels] = useState(dummyHotels);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", location: "", rating: "", contact: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddHotel = () => {
    console.log('hotel data:', form)
    setHotels([...hotels, { id: Date.now(), ...form }]);
    setForm({ name: "", address: "", location: "", rating: "", contact: "" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Hotels</h1>

      <button onClick={() => setShowModal(true)} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md">
        + Add Hotel
      </button>

      <div className="space-y-4">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold">{hotel.name}</h2>
            <p>{hotel.address}</p>
            <p>{hotel.location} – {hotel.rating}⭐</p>
            <p>Contact: {hotel.contact}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg">
            <h2 className="text-2xl mb-4">Add New Hotel</h2>
            {["name", "address", "location", "rating", "contact"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-1 capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            ))}
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 rounded-md">Cancel</button>
              <button onClick={handleAddHotel} className="px-4 py-2 bg-blue-600 text-white rounded-md">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsPage;
