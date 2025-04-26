"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { TripHeader } from "./components/TripHeader";
import { TripOverview } from "./components/TripOverview";
import { ItinerarySection } from "./components/ItinerarySection";
import { CustomersSection } from "./components/CustomersSection";
import { AddCustomerModal } from "./components/AddCustomerModal";
import { AddPaymentModal } from "./components/AddPaymentModal";
import { ServerUrl } from "@/app/config";
import axios from "axios";
import auth from "@/utils/auth";
import ProtectedRoute from "@/components/ProtectedRoutes";
import { getUserFromToken } from "@/utils/auth";
const TripDetailsPage = ({ params }) => {
  const router = useRouter();
  const tripId = use(params).tripId;
  const token = auth.getToken();

  // State and data initialization
  const [trip, setTrip] = useState({});

  const [tempTrip, setTempTrip] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Customer and payment state
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newCustomerBooking, setNewCustomerBooking] = useState({
    customer: {
      name: "",
      contact: "", // Will be validated
    },
    booking: {
      tripId: tripId, // Should be passed as prop
      noOfPeople: 1,
      agreedPrice: 0,

      payment: {
        amount: 0,
        method: "online",
        status: "pending",
      },
    },
  });

  const [newPayment, setNewPayment] = useState({
    amount: 0,
    method: "online",
    transactionId: "",
    receiver: "",
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const user = getUserFromToken();

  if (user) {
    console.log("Logged-in user:", user);
  } else {
    console.log("No user is logged in or token is invalid");
  }

  //  API fetch trip
  useEffect(() => {
    const fetchTripData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${ServerUrl}/tripRequirement/viewTrip?_id=${tripId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.result) {
          setTrip(response.data.result);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Failed to fetch trip data:", error);
        // You might want to handle errors here, like showing a notification
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      // Only fetch if tripId exists
      fetchTripData();
    }
  }, [tripId]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${ServerUrl}/booking/getBookingList`, {
          params: {
            tripId: tripId // optional filter
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setBookings(response.data.result);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    if (tripId) {
      fetchBookings();
    }
  }, [tripId]);

  useEffect(() => {
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${ServerUrl}/customer/getCustomerList?_id=${tripId}`, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.result) {
                setCustomers(response.data.result);
                
                // Extract bookings from customers if needed
                const allBookings = response.data.result.flatMap(c => c.bookings || []);
                setBookings(allBookings);
            }
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    };

    if (tripId) {
        fetchCustomers();
    }
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

  const addCustomerWithBooking = async () => {
    try {
      setLoading(true);
      const currentUser = getUserFromToken();

      // Validate phone number
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
      if (!phoneRegex.test(newCustomerBooking.customer.contact)) {
        alert("Please enter a valid phone number");
        return;
      }

      // Create customer first
      const customerResponse = await axios.post(
        `${ServerUrl}/customer/createCustomer`,
        {
          name: newCustomerBooking.customer.name,
          contact: newCustomerBooking.customer.contact,
          createdBy: currentUser.userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Then create booking with payment
      const bookingResponse = await axios.post(
        `${ServerUrl}/booking/createBooking`,
        {
          userId: customerResponse.data.result._id, // Link booking to customer
          tripId: newCustomerBooking.booking.tripId,
          noOfPeople: newCustomerBooking.booking.noOfPeople,
          agreedPrice: newCustomerBooking.booking.agreedPrice,
          specialRequirements: newCustomerBooking.booking.specialRequirements,
          payments: [newCustomerBooking.booking.payment],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state
      setCustomers((prev) => [...prev, customerResponse.data.result]);
      setBookings((prev) => [...prev, bookingResponse.data.result]);

      // Reset form
      setNewCustomerBooking({
        customer: { name: "", contact: "" },
        booking: {
          tripId: newCustomerBooking.booking.tripId, // Keep same trip
          noOfPeople: 1,
          agreedPrice: 0,
          specialRequirements: "",
          payment: { amount: 0, method: "online", status: "pending" },
        },
      });

      setShowCustomerForm(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create customer and booking");
    } finally {
      setLoading(false);
    }
  };

  const addPaymentToBooking = async (bookingId, paymentData) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${ServerUrl}/booking/addPayment`,
        {
          bookingId,
          ...paymentData,
          status: "paid", // Default to paid when manually adding
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, payments: response.data.result.payments }
            : b
        )
      );

      return true;
    } catch (error) {
      console.error("Payment failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const calculatePaymentSummary = (booking) => {
    const totalPaid =
      booking.payments?.reduce(
        (sum, payment) =>
          payment.status === "paid" ? sum + payment.amount : sum,
        0
      ) || 0;

    const balance = Math.max(0, booking.agreedPrice - totalPaid);
    const paymentProgress =
      booking.agreedPrice > 0 ? (totalPaid / booking.agreedPrice) * 100 : 0;

    return { totalPaid, balance, paymentProgress };
  };

  const handleSaveTrip = async (updatedTrip) => {
    setLoading(true);
    try {
      // Here you would call your actual API
      console.log("Sending to API:", updatedTrip);
      // const response = await updateTripApi(updatedTrip);
      // setTrip(response.data);

      // For now, just update local state
      setTrip(updatedTrip);
    } catch (error) {
      console.error("Failed to save trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );
    if (!isConfirmed) return;
    try {
      await axios.delete(`${ServerUrl}/tripRequirement/deleteTrip`, {
        data: { _id: tripId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        <TripHeader trip={trip} onBack={() => router.back()} />

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <TripOverview trip={trip} loading={loading} onSave={handleSaveTrip} />

          <CustomersSection
            customers={customers}
            bookings={bookings} // Pass bookings to the component
            onAddCustomer={() => setShowCustomerForm(true)}
            onAddPayment={(customerId) => {
              // Find the booking for this customer
              const customerBooking = bookings.find(
                (b) => b.userId === customerId
              );
              if (customerBooking) {
                setSelectedBooking(customerBooking);
                // Set initial payment amount to the remaining balance
                setNewPayment((prev) => ({
                  ...prev,
                  amount: calculatePaymentSummary(customerBooking).balance,
                }));
                setShowPaymentForm(true);
              }
            }}
          />
          <div className="mt-4 w-full flex justify-end">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white rounded px-2 py-1 text-sm"
            >
              Delete
            </button>
          </div>
        </main>

        <AddCustomerModal
          isOpen={showCustomerForm}
          onClose={() => {
            setShowCustomerForm(false);
            // Reset form state when closing
            setNewCustomerBooking({
              customer: { name: "", contact: "" },
              booking: {
                tripId,
                noOfPeople: 1,
                agreedPrice: 0,
                specialRequirements: "",
                payment: { amount: 0, method: "online" },
              },
            });
          }}
          tripId={tripId}
          onSubmit={addCustomerWithBooking}
          loading={loading}
        />

        <AddPaymentModal
          isOpen={showPaymentForm}
          onClose={() => {
            setShowPaymentForm(false);
            setSelectedBooking(null); // Clear selected booking
            setNewPayment({
              amount: 0,
              method: "online",
              transactionId: "",
              receiver: "",
              notes: "",
            });
          }}
          booking={selectedBooking} // Now this will work
          payment={newPayment}
          setPayment={setNewPayment}
          onSubmit={addPaymentToBooking}
          loading={loading}
        />
      </div>
    </ProtectedRoute>
  );
};

export default TripDetailsPage;
