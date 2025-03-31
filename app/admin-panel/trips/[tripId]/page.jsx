"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { TripHeader } from "./components/TripHeader";
import { TripOverview } from "./components/TripOverview";
import { ItinerarySection } from "./components/ItinerarySection";
import { CustomersSection } from "./components/CustomersSection";
import { AddCustomerModal } from "./components/AddCustomerModal";
import { AddPaymentModal } from "./components/AddPaymentModal";

const TripDetailsPage = ({ params }) => {
  const router = useRouter();
  const tripId = use(params).tripId;

  // State and data initialization
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

  const [tempTrip, setTempTrip] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Customer and payment state
  const [customers, setCustomers] = useState([]);
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
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);



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

      console.log('customer data:',customerData)

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

  useEffect(() => {
    console.log(customers)
  },[customers])

  const addPayment = async () => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);
console.log('new payment:',newPayment)
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


  return (
    <div className="min-h-screen bg-gray-50">
      <TripHeader trip={trip} onBack={() => router.back()} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <TripOverview 
        trip={trip} 
        loading={loading} 
        onSave={handleSaveTrip} 
      />
        
        <ItinerarySection
          itinerary={editMode ? tempTrip.itinerary : trip.itinerary}
          editMode={editMode}
          onItineraryChange={handleItineraryChange}
        />
        
        <CustomersSection
          customers={customers}
          onAddCustomer={() => setShowCustomerForm(true)}
          onAddPayment={(customerId) => {
            setSelectedCustomer(customerId);
            setShowPaymentForm(true);
          }}
        />
      </main>

      <AddCustomerModal
        isOpen={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
        customerData={newCustomer}
        onCustomerChange={(field, value) => 
          setNewCustomer(prev => ({ ...prev, [field]: value }))
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
  );
};

export default TripDetailsPage;