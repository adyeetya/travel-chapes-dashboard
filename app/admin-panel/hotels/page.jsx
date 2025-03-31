"use client";
import { useState } from "react";
import axios from "axios";
import { ServerUrl } from "@/app/config";
import auth from "@/utils/auth";
const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", location: "", rating: "", contact: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const token = auth.getToken()
  const fetchHotels = async () => {
    try {
      const { data } = await axios.get("/api/hotels");
      setHotels(data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddHotel = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${ServerUrl}/tripRequirement/createHotel`, form);
      console.log('create hotel:',data)
      setHotels([...hotels, data]);
      setShowModal(false);
      setForm({ name: "", address: "", location: "", rating: "", contact: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add hotel");
    } finally {
      setLoading(false);
    }
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
          <div className="p-8 bg-white rounded-lg w-96">
            <h2 className="text-2xl mb-4">Add New Hotel</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {Object.keys(form).map((field) => (
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
              <button onClick={handleAddHotel} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsPage;
