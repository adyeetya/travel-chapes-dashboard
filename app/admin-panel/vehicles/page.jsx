"use client";
import { useState } from "react";

const dummyVehicles = [
  { id: 1, name: "SUV", maxPeople: 7, type: "Luxury", contact: "123-456-7890" },
  { id: 2, name: "Sedan", maxPeople: 4, type: "Standard", contact: "987-654-3210" },
];

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState(dummyVehicles);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", maxPeople: "", type: "", contact: "" });

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new vehicle
  const handleAddVehicle = () => {
    console.log('vehicle data:', form)
    setVehicles([...vehicles, { id: Date.now(), ...form }]);
    setForm({ name: "", maxPeople: "", type: "", contact: "" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Vehicles</h1>

      {/* Add Vehicle Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        + Add Vehicle
      </button>

      {/* Vehicles List */}
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold">{vehicle.name}</h2>
            <p>Max People: {vehicle.maxPeople}</p>
            <p>Type: {vehicle.type}</p>
            <p>Contact: {vehicle.contact}</p>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg w-full max-w-md">
            <h2 className="text-2xl mb-4">Add New Vehicle</h2>

            {["name", "maxPeople", "type", "contact"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                <input
                  type={field === "maxPeople" ? "number" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            ))}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVehicle}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;
