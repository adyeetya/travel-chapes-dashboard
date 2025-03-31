"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ServerUrl } from "@/app/config";
import auth from "@/utils/auth";
const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    city: "",
    state: "",
    country: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = auth.getToken();
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          `${ServerUrl}/tripRequirement/getLocationList`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log('res', response.data)
        setLocations(response.data?.result || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to fetch locations");
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddLocation = async () => {
    setLoading(true);
    try {

      console.log('sending form:', form)
      const response = await axios.post(
        `${ServerUrl}/tripRequirement/createLocation`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocations([...locations, response.data.result]);
      setForm({ city: "", state: "", country: "", description: "" });
      setShowModal(false);
    } catch (err) {
      console.error("Error adding location:", err);
      setError("Failed to add location");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Locations</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        + Add Location
      </button>

      {/* Locations List */}
      <div className="space-y-4">
        {locations.length !== 0 && locations?.map((location) => (
          <div key={location._id} className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold">
              {location.city}, {location.state}
            </h2>
            <p>{location.country}</p>
            <p className="text-gray-600">{location.description}</p>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg">
            <h2 className="text-2xl mb-4">Add New Location</h2>
            {["city", "state", "country"].map((field) => (
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
            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsPage;
