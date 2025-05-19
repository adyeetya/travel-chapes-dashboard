"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ServerUrl } from "@/app/config";
import auth from "@/utils/auth";
import ProtectedRoute from "@/components/ProtectedRoutes";
import { FiSearch } from "react-icons/fi";

const STATUS_OPTIONS = [
  "pending",
  "contacted",
  "in_progress",
  "converted",
  "closed",
  "spam",
];
const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    destination: '',
    phone: '',
    email: '',
    travelers: '',
  });
  const [addStatus, setAddStatus] = useState({ loading: false, error: '', success: false });
  const token = auth.getToken();
  const admin = auth.getUserFromToken();

  const handleApiError = (error, context) => {
    if (error.code === "ERR_NETWORK") {
      setError(`Network error while ${context}. Please check your internet connection.`);
    } else if (error.response) {
      const message = error.response.data?.responseMessage || error.response.statusText;
      setError(`Error ${context}: ${message} (Status: ${error.response.status})`);
    } else if (error.request) {
      setError(`No response received while ${context}. Please try again.`);
    } else {
      setError(`Unexpected error while ${context}: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${ServerUrl}/user/getAllQueries`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('res>', response.data);
        setLeads(response.data?.result || []);
        setFilteredLeads(response.data?.data || []);
      } catch (err) {
        handleApiError(err, "fetching leads");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let filtered = leads;
    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }
    filtered = filtered.filter(
      (lead) =>
        lead?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead?.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead?.travelers?.toString().includes(searchTerm)
    );
    setFilteredLeads(filtered);
  }, [searchTerm, leads, statusFilter]);

  // Update status handler
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axios.put(
        `${ServerUrl}/user/updateQueryStatus`,
        { _id: leadId, status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
    } catch (err) {
      handleApiError(err, "updating status");
    }
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    setAddStatus({ loading: true, error: '', success: false });
    try {
      const response = await axios.post(
        `${ServerUrl}/user/postQuery`,
        {
          ...addForm,
          createdFrom: admin?.email || 'admin',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddStatus({ loading: false, error: '', success: true });
      setAddForm({ name: '', destination: '', phone: '', email: '', travelers: '' });
      setShowAddModal(false);
      // Refresh leads
      const leadsRes = await axios.get(
        `${ServerUrl}/user/getAllQueries`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeads(leadsRes.data?.result || leadsRes.data?.data || []);
    } catch (err) {
      setAddStatus({ loading: false, error: err.message || 'Failed to add lead', success: false });
    }
  };

  return (
    <ProtectedRoute allowedAdminTypes={['ADMIN', 'SALES']}>
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Leads Management</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              + Add Lead
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Filter Bar */}
          <div className="mb-6 flex gap-4 items-center">
            <div className="relative max-w-md flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Leads Table */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              {filteredLeads.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchTerm ? "No matching leads found" : "No leads available"}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travelers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.destination}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.travelers}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(lead.createdAt).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={lead.status || 'pending'}
                            onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Add Lead Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
                <form onSubmit={handleAddLead} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={addForm.name}
                    onChange={handleAddFormChange}
                    placeholder="Name"
                    className="w-full border rounded p-2"
                    required
                  />
                  <input
                    type="text"
                    name="destination"
                    value={addForm.destination}
                    onChange={handleAddFormChange}
                    placeholder="Destination"
                    className="w-full border rounded p-2"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={addForm.phone}
                    onChange={handleAddFormChange}
                    placeholder="Phone"
                    className="w-full border rounded p-2"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={addForm.email}
                    onChange={handleAddFormChange}
                    placeholder="Email"
                    className="w-full border rounded p-2"
                    required
                  />
                  <input
                    type="number"
                    name="travelers"
                    value={addForm.travelers}
                    onChange={handleAddFormChange}
                    placeholder="Number of Travelers"
                    className="w-full border rounded p-2"
                    required
                  />
                  {addStatus.error && <div className="text-red-500 text-sm">{addStatus.error}</div>}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={addStatus.loading}
                  >
                    {addStatus.loading ? 'Adding...' : 'Add Lead'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LeadsPage;