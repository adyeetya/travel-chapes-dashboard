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
const TripDetailsPage = ({ params }) => {
  // .post("/createCustomer", controller.createCustomer)
  // .post("/addPayment", controller.addPayment)
  // .get("/getCustomerList", controller.getcustomerList)

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
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    agreedPrice: 0,
    numOfPeople: 1,
  });

  const [newPayment, setNewPayment] = useState({
    amount: 0,
    method: "online",
    transactionId: "",
    receiver: "",
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${ServerUrl}/customer/getCustomerList?_id=${tripId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.result) {
          // Assuming your response wrapper has a 'data' property
          setCustomers(response.data.result);
        } else {
          console.error("Unexpected response format:", response);
        }


      } catch (error) {

        if (error.status === 404) {
          console.log('No Customers Found')
        } else {
          console.error("Failed to fetch trip data:", error);
        }

      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
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
        agreedPrice: newCustomer.agreedPrice * newCustomer.numOfPeople, // Calculate total price
        tripId,
      };

console.log('customerData',customerData)

      // Simulate API delay
      const response = await axios.post(
        `${ServerUrl}/customer/createCustomer`,
        customerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setCustomers((prev) => [...prev, response.data.result]);
      setTrip((prev) => ({
        ...prev,
        customerIds: [...(prev.customerIds || []), response.data.result._id],
      }));

      setShowCustomerForm(false);
      setNewCustomer({
        name: "",
        contact: "",
        agreedPrice: 0,
        numOfPeople: 1,
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
        _id: customer._id,
        payment: newPayment,
      };


      const res = await axios.post(
        `${ServerUrl}/customer/addPayment`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );



      setCustomers((prevCustomers) =>
        prevCustomers.map((c) =>
          c._id === selectedCustomer
            ? { ...c, payments: res.data.result.payments } // Update only the matching customer
            : c
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
    const isConfirmed = window.confirm("Are you sure you want to delete this trip?");
    if (!isConfirmed) return;
    try {
      await axios.delete(
        `${ServerUrl}/tripRequirement/deleteTrip`,
        {
          data: { _id: tripId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.back()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProtectedRoute allowedAdminTypes={['ADMIN', 'SALES']}>
      <div className="min-h-screen bg-gray-50">
        <TripHeader trip={trip} onBack={() => router.back()} />

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <TripOverview trip={trip} loading={loading} onSave={handleSaveTrip} />

          <CustomersSection
            customers={customers}
            onAddCustomer={() => setShowCustomerForm(true)}
            onAddPayment={(customerId) => {
              setSelectedCustomer(customerId);
              setShowPaymentForm(true);
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
          onClose={() => setShowCustomerForm(false)}
          customerData={newCustomer}
          onCustomerChange={(field, value) =>
            setNewCustomer((prev) => ({ ...prev, [field]: value }))
          }
          onSubmit={addCustomer}
          loading={loading}
        />

        <AddPaymentModal
          isOpen={showPaymentForm}
          onClose={() => setShowPaymentForm(false)}
          onSubmit={addPayment}
          loading={loading}
          payment={newPayment}
          setPayment={setNewPayment}
        />
      </div>
    </ProtectedRoute>
  );
};

export default TripDetailsPage;