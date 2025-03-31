"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ServerUrl } from "@/app/config";
import auth from "@/utils/auth";


const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    maxPeople: "", 
    type: "", 
    contact: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const token = auth.getToken();
  useEffect(() => {
    const fetchHotels = async () => {
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
        // console.log(response.data)
        setVehicles(response.data?.result);
        setFilteredVehicles(response.data?.result);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to fetch vehicles");
      }
    };
    fetchHotels();
  }, []);



  useEffect(() => {
    const filtered = vehicles.filter(vehicle => 
      vehicle?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.maxPeople?.toString().includes(searchTerm)
    );
    setFilteredVehicles(filtered);
  }, [searchTerm, vehicles]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddVehicle = async () => {
    if (!form.name || !form.maxPeople || !form.type || !form.contact) {
      setError("All fields are required");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const { data } = await axios.post(
        `${ServerUrl}/tripRequirement/createVehicale`,
        {
          name: form.name,
          maxPeople: parseInt(form.maxPeople),
          type: form.type,
          contact: form.contact
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Assuming the API returns the created vehicle in data.result
      // console.log('result of add veh',data.result)
      const newVehicle = data.result 
  
      setVehicles([...vehicles, newVehicle]);
      setFilteredVehicles([...filteredVehicles, newVehicle]);
      setForm({ name: "", maxPeople: "", type: "", contact: "" });
      setShowModal(false);
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async(id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }
    try {
      const data =  {
        _id:id,
        type:'vehicle'
      }
      await axios.delete(
        `${ServerUrl}/tripRequirement/deleteLocationHotelVechile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: data  
        }
      );
      setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
    setFilteredVehicles(filteredVehicles.filter(vehicle => vehicle._id !== id));
    } catch (error) {
      console.error("Error deleting location:", err);
      setError("Failed to delete location");
    }
    
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Vehicles Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Vehicle
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

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
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {filteredVehicles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? "No matching vehicles found" : "No vehicles available"}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max People
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.maxPeople}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.contact || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteVehicle(vehicle._id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Vehicle</h3>
                {error && <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">{error}</div>}
                <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                  {["name", "maxPeople", "type", "contact"].map((field) => (
                    <div key={field} className={field === "contact" ? "sm:col-span-6" : "sm:col-span-3"}>
                      <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type={field === "maxPeople" ? "number" : "text"}
                        name={field}
                        id={field}
                        value={form[field]}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required={["name", "maxPeople", "type"].includes(field)}
                        min={field === "maxPeople" ? "1" : undefined}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddVehicle}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : "Add Vehicle"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;