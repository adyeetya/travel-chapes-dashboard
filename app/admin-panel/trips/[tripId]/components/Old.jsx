"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spline_Sans } from "next/font/google";

const TripDetailsPage = ({ params }) => {
  const router = useRouter();
  const tripId = use(params).tripId;

  // Dummy trip data with itinerary
  const [trip, setTrip] = useState({
    id: "1",
    location: "Golden Triangle",
    pickup: "Delhi",
    viaPoints: ["Agra", "Jaipur"],
    drop: "Delhi",
    startDate: "2025-04-10",
    endDate: "2025-04-14",
    days: 5,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Goa",
        description: "Check-in at hotel, evening beach visit",
        activities: [
          "Hotel check-in",
          "Anjuna Beach visit",
          "Dinner at local restaurant",
        ],
      },
      {
        day: 2,
        title: "North Goa Exploration",
        description: "Full day tour of North Goa beaches and forts",
        activities: [
          "Baga Beach",
          "Fort Aguada",
          "Chapora Fort",
          "Night market",
        ],
      },
    ],
    vehicles: ["Car", "Bus"],
    stays: ["Hotel Taj", "Jaipur Palace", "Delhi Grand"],
    meals: ["Breakfast", "Lunch", "Dinner"],
    pricing: {
      car: {
        single: 25000,
        double: 22000,
        triple: 20000,
      },
      bus: {
        single: 18000,
        double: 16000,
        triple: 14000,
      },
      gst: 18,
    },
    customerIds: [],
  });

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempTrip, setTempTrip] = useState({});

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    agreedPrice: 0,
    people: 1,
  });

  const [newPayment, setNewPayment] = useState({
    amount: 0,
    method: "online",
    transactionId: "",
    receiver: "",
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulate API fetch
  useEffect(() => {
    const fetchTripData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // In a real app, you would fetch from your API
        // const res = await fetch(`/api/trips/${tripId}`);
        // const data = await res.json();

        // Using our dummy data directly
        setTempTrip({ ...trip });
      } catch (error) {
        console.error("Failed to fetch trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  const saveTripChanges = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In real app: await fetch(`/api/trips/${tripId}`, { method: 'PUT', body: JSON.stringify(tempTrip) });

      setTrip({ ...tempTrip });
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async () => {
    try {
      setLoading(true);
      const customerData = {
        ...newCustomer,
        tripId,
        payments: [],
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockResponse = {
        _id: Math.random().toString(36).substring(2, 15),
        ...customerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCustomers((prev) => [...prev, mockResponse]);
      setTrip((prev) => ({
        ...prev,
        customerIds: [...(prev.customerIds || []), mockResponse._id],
      }));

      setShowCustomerForm(false);
      setNewCustomer({
        name: "",
        contact: "",
        agreedPrice: 0,
        people: 1,
      });
    } catch (error) {
      console.error("Error adding customer:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async () => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);

      const customer = customers.find((c) => c._id === selectedCustomer);
      const { balance } = calculatePaymentSummary(customer);

      if (newPayment.amount <= 0) {
        alert("Payment amount must be positive");
        return;
      }

      if (balance === 0) {
        alert("Customer has already paid in full");
        return;
      }

      const paymentData = {
        ...newPayment,
        date: new Date().toISOString().split("T")[0],
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockPayment = {
        _id: Math.random().toString(36).substring(2, 15),
        ...paymentData,
        createdAt: new Date().toISOString(),
      };

      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === selectedCustomer
            ? { ...customer, payments: [...customer.payments, mockPayment] }
            : customer
        )
      );

      setShowPaymentForm(false);
      setNewPayment({
        amount: 0,
        method: "online",
        transactionId: "",
        receiver: "",
      });
    } catch (error) {
      console.error("Error adding payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePaymentSummary = (customer) => {
    const totalPaid =
      customer.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const balance = Math.max(0, customer.agreedPrice - totalPaid);
    return { totalPaid, balance };
  };

  const handleItineraryChange = (index, field, value) => {
    const updatedItinerary = [...tempTrip.itinerary];
    updatedItinerary[index] = {
      ...updatedItinerary[index],
      [field]: value,
    };
    setTempTrip({ ...tempTrip, itinerary: updatedItinerary });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Trips
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Trip Management Dashboard
          </h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Trip Overview Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {trip.location} Trip Overview
              <span className="ml-2 text-sm font-normal text-gray-500">
                (ID: {trip.id})
              </span>
            </h2>
            <button
              onClick={() => (editMode ? saveTripChanges() : setEditMode(true))}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                editMode
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:${editMode ? "bg-green-700" : "bg-gray-300"}`}
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
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Dates
                </h3>
                {editMode ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={tempTrip.startDate}
                      onChange={(e) =>
                        setTempTrip({ ...tempTrip, startDate: e.target.value })
                      }
                      className="p-2 border rounded-md"
                    />
                    <input
                      type="date"
                      value={tempTrip.endDate}
                      onChange={(e) =>
                        setTempTrip({ ...tempTrip, endDate: e.target.value })
                      }
                      className="p-2 border rounded-md"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {trip.startDate} to {trip.endDate} ({trip.days} days)
                  </p>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Route
                </h3>
                {editMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={tempTrip.pickup}
                      onChange={(e) =>
                        setTempTrip({ ...tempTrip, pickup: e.target.value })
                      }
                      placeholder="Pickup location"
                      className="w-full p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      value={tempTrip.viaPoints.join(", ")}
                      onChange={(e) =>
                        setTempTrip({
                          ...tempTrip,
                          viaPoints: e.target.value
                            .split(",")
                            .map((s) => s.trim()),
                        })
                      }
                      placeholder="Via points (comma separated)"
                      className="w-full p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      value={tempTrip.drop}
                      onChange={(e) =>
                        setTempTrip({ ...tempTrip, drop: e.target.value })
                      }
                      placeholder="Drop location"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {trip.pickup} → {trip.viaPoints.join(" → ")} → {trip.drop}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Inclusions
                </h3>
                {editMode ? (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Vehicles
                      </label>
                      <input
                        type="text"
                        value={tempTrip.vehicles.join(", ")}
                        onChange={(e) =>
                          setTempTrip({
                            ...tempTrip,
                            vehicles: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Stays
                      </label>
                      <input
                        type="text"
                        value={tempTrip.stays.join(", ")}
                        onChange={(e) =>
                          setTempTrip({
                            ...tempTrip,
                            stays: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Meals
                      </label>
                      <input
                        type="text"
                        value={tempTrip.meals.join(", ")}
                        onChange={(e) =>
                          setTempTrip({
                            ...tempTrip,
                            meals: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-gray-900">
                      <span className="font-medium">Vehicles:</span>{" "}
                      {trip.vehicles.join(", ")}
                    </p>
                    <p className="text-gray-900">
                      <span className="font-medium">Stays:</span>{" "}
                      {trip.stays.join(", ")}
                    </p>
                    <p className="text-gray-900">
                      <span className="font-medium">Meals:</span>{" "}
                      {trip.meals.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Pricing */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Pricing
              </h3>
              {editMode ? (
                <div className="space-y-4">
                  {trip.vehicles.map((vehicle) => (
                    <div key={vehicle}>
                      <label className="block text-xs text-gray-500 mb-1">
                        {vehicle} Prices (₹)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          placeholder="Single"
                          value={
                            tempTrip.pricing[vehicle.toLowerCase()]?.single ||
                            ""
                          }
                          onChange={(e) =>
                            setTempTrip({
                              ...tempTrip,
                              pricing: {
                                ...tempTrip.pricing,
                                [vehicle.toLowerCase()]: {
                                  ...tempTrip.pricing[vehicle.toLowerCase()],
                                  single: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="p-2 border rounded-md"
                        />
                        <input
                          placeholder="Double"
                          value={
                            tempTrip.pricing[vehicle.toLowerCase()]?.double ||
                            ""
                          }
                          onChange={(e) =>
                            setTempTrip({
                              ...tempTrip,
                              pricing: {
                                ...tempTrip.pricing,
                                [vehicle.toLowerCase()]: {
                                  ...tempTrip.pricing[vehicle.toLowerCase()],
                                  double: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="p-2 border rounded-md"
                        />
                        <input
                          placeholder="Triple"
                          value={
                            tempTrip.pricing[vehicle.toLowerCase()]?.triple ||
                            ""
                          }
                          onChange={(e) =>
                            setTempTrip({
                              ...tempTrip,
                              pricing: {
                                ...tempTrip.pricing,
                                [vehicle.toLowerCase()]: {
                                  ...tempTrip.pricing[vehicle.toLowerCase()],
                                  triple: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="p-2 border rounded-md"
                        />
                      </div>
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      GST (%)
                    </label>
                    <input
                      value={tempTrip.pricing.gst}
                      onChange={(e) =>
                        setTempTrip({
                          ...tempTrip,
                          pricing: {
                            ...tempTrip.pricing,
                            gst: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {trip.vehicles.map((vehicle) => (
                    <div key={vehicle}>
                      <span className="font-medium">{vehicle}:</span>
                      <div className="ml-2 text-sm">
                        {["single", "double", "triple"].map((type, i, arr) => (
                          <span key={type}>
                            <span>
                              {type.charAt(0).toUpperCase() + type.slice(1)}: ₹
                              {trip.pricing[vehicle.toLowerCase()]?.[
                                type
                              ]?.toLocaleString() || "N/A"}
                            </span>
                            {i < arr.length - 1 && (
                              <span className="mx-2">|</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <p>
                    <span className="font-medium">GST:</span> {trip.pricing.gst}
                    %
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Itinerary</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {(editMode ? tempTrip.itinerary : trip.itinerary).map(
              (day, index) => (
                <div key={index} className="px-6 py-4">
                  {editMode ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Day {day.day} Title
                        </label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) =>
                            handleItineraryChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Description
                        </label>
                        <textarea
                          value={day.description}
                          onChange={(e) =>
                            handleItineraryChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md"
                          rows="2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Activities (one per line)
                        </label>
                        <textarea
                          value={day.activities.join("\n")}
                          onChange={(e) =>
                            handleItineraryChange(
                              index,
                              "activities",
                              e.target.value.split("\n")
                            )
                          }
                          className="w-full p-2 border rounded-md"
                          rows="4"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Day {day.day}: {day.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{day.description}</p>
                      {day.activities.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {day.activities.map((activity, i) => (
                            <li key={i} className="flex items-start">
                              <svg
                                className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-gray-700">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Customers Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
            {/* <button 
              onClick={() => setShowCustomerForm(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              + Add Customer
            </button> */}
          </div>

          {customers.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No customers
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new customer.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCustomerForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Customer
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      People
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Paid
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Balance
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => {
                    const { totalPaid, balance } =
                      calculatePaymentSummary(customer);
                    return (
                      <tr key={customer._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.people}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{customer.agreedPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{totalPaid.toLocaleString()}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            balance > 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          ₹{balance.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer._id);
                              setShowPaymentForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Add Payment
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Customer Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Customer
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contact"
                  value={newCustomer.contact}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, contact: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="people"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of People
                </label>
                <input
                  type="number"
                  id="people"
                  min="1"
                  value={newCustomer.people}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      people: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Agreed Price (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="100"
                  value={newCustomer.agreedPrice}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      agreedPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCustomerForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={addCustomer}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? "Adding..." : "Add Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Payment
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  min="0"
                  step="100"
                  value={newPayment.amount}
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      amount: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="method"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Payment Method
                </label>
                <select
                  id="method"
                  value={newPayment.method}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, method: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="online">Online Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              {newPayment.method === "online" && (
                <div>
                  <label
                    htmlFor="transactionId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    value={newPayment.transactionId}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        transactionId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              {(newPayment.method === "cash" ||
                newPayment.method === "cheque") && (
                <div>
                  <label
                    htmlFor="receiver"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Received By
                  </label>
                  <input
                    type="text"
                    id="receiver"
                    value={newPayment.receiver}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, receiver: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={addPayment}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? "Processing..." : "Record Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetailsPage;
