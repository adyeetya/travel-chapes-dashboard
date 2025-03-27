"use client";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";

// Customer schema
const createCustomer = (customerData) => ({
  id: `cust_${Date.now()}`,
  ...customerData,
  payments: []
});

// Payment schema
const createPayment = (paymentData) => ({
  id: `pay_${Date.now()}`,
  ...paymentData,
  date: new Date().toISOString().split('T')[0]
});

const TripDetailsPage = ({ params }) => {
  const router = useRouter();
  const tripId = use(params).tripId;
  
  // In a real app, you would fetch this data based on tripId
  const [trip, setTrip] = useState({
    id: "1",
    location: "Goa",
    pickup: "Mumbai",
    viaPoints: ["Pune"],
    drop: "Goa Airport",
    startDate: "2023-12-15",
    endDate: "2023-12-20",
    days: 5,
    itinerary: ["Day 1 content", "Day 2 content"],
    vehicles: ["Car"],
    stays: ["Hotel A"],
    meals: ["Breakfast", "Lunch"],
    pricing: { 
      car: { price: 15000 }, 
      bus: {}, 
      gst: 18 
    },
    customerIds: [] 
  });



  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    agreedPrice: 0,
    people: 1
  });
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    method: "online",
    transactionId: "",
    receiver: ""
  });

  const [customers, setCustomers] = useState([]); // Stores full customer data
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch trip data
        // const tripRes = await fetch(`/api/trips/${tripId}`);
        // const tripData = await tripRes.json();
        // setTrip(tripData);

        // Fetch customers for this trip
        // if (tripData.customerIds?.length) {
        //   const customersRes = await fetch(`/api/customers?tripId=${tripId}`);
        //   const customersData = await customersRes.json();
        //   setCustomers(customersData);
        // }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  useEffect(() => {
    console.log('Current trip:', trip);
    console.log('Current customers:', customers);
  }, [trip, customers]);

  const addCustomer = async () => {
    try {
      setLoading(true);
      const customerData = {
        ...newCustomer,
        tripId,
        payments: []
      };
  
      console.log('Adding customer:', customerData); 
      // Simulate API call
      // const response = await fetch('/api/customers', {
      //   method: 'POST',
      //   body: JSON.stringify(customer)
      // });
      // const createdCustomer = await response.json();

      // Update local state directly instead of API response
      
      const mockResponse = {
        _id: Math.random().toString(36).substring(2, 15), // Simulated MongoDB ID
        ...customerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCustomers(prev => [...prev, mockResponse]);
      setTrip(prev => ({
        ...prev,
        customerIds: [...(prev.customerIds || []), mockResponse._id] // Ensure customerIds is an array
      }));

      setShowCustomerForm(false);
      setNewCustomer({
        name: "",
        contact: "",
        agreedPrice: 0,
        people: 1
      });
    } catch (error) {
      console.error("Error adding customer:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async () => {
    console.log(selectedCustomer)
    if (!selectedCustomer) return;
    
    try {
      setLoading(true);
      
      // Validate payment amount doesn't create negative balance
      const customer = customers.find(c => c._id === selectedCustomer);
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
        date: new Date().toISOString().split('T')[0]
      };
  
      console.log('Adding payment:', paymentData, 'to customer:', selectedCustomer);
      
      // Simulate API response with MongoDB-like ID
      const mockPayment = {
        _id: Math.random().toString(36).substring(2, 15), // Simulated MongoDB ID
        ...paymentData,
        createdAt: new Date().toISOString()
      };
  
      // Update local state
      setCustomers(prev => 
        prev.map(customer => 
          customer._id === selectedCustomer
            ? { 
                ...customer, 
                payments: [...customer.payments, mockPayment] 
              }
            : customer
        )
      );
      
      setShowPaymentForm(false);
      setNewPayment({
        amount: 0,
        method: "online",
        transactionId: "",
        receiver: ""
      });
    } catch (error) {
      console.error("Error adding payment:", error);
    } finally {
      setLoading(false);
    }
  };
  


  const calculatePaymentSummary = (customer) => {
    const totalPaid = customer.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const balance = Math.max(0, customer.agreedPrice - totalPaid); // Ensure balance is never negative
    return { totalPaid, balance };
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <button 
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        ← Back to Trips
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{trip.location} Trip Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Trip Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Dates:</span> {trip.startDate} to {trip.endDate}</p>
              <p><span className="font-medium">Days:</span> {trip.days}</p>
              <p><span className="font-medium">Pickup:</span> {trip.pickup}</p>
              <p><span className="font-medium">Drop:</span> {trip.drop}</p>
              <p><span className="font-medium">Via Points:</span> {trip.viaPoints.join(", ")}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Pricing</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Car Price:</span> ₹{trip.pricing.car.price?.toLocaleString() || '0'}</p>
              <p><span className="font-medium">Bus Price:</span> ₹{trip.pricing.bus.price?.toLocaleString() || '0'}</p>
              <p><span className="font-medium">GST:</span> {trip.pricing.gst}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Customers</h2>
          <button 
            onClick={() => setShowCustomerForm(true)}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            + Add Customer
          </button>
        </div>

        {customers.length === 0 ? (
          <p className="text-gray-500">No customers yet</p>
        ) : (
          <div className="space-y-4">
            {customers.map(customer => {
              const { totalPaid, balance } = calculatePaymentSummary(customer);
              return (
                <div key={customer.contact} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.contact}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedCustomer(customer._id);
                        setShowPaymentForm(true);
                      }}
                      className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm"
                    >
                      Add Payment
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <p><span className="font-medium">People:</span> {customer.people}</p>
                    <p><span className="font-medium">Agreed Price:</span> ₹{customer.agreedPrice}</p>
                    <p><span className="font-medium">Paid:</span> ₹{totalPaid}</p>
                    <p><span className="font-medium">Balance:</span> ₹{balance}</p>
                  </div>
                  {customer.payments.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium text-sm mb-1">Payment History</h4>
                      <div className="space-y-1">
                        {customer.payments.map(payment => (
                          <div key={payment.id} className="text-xs bg-gray-50 p-2 rounded">
                            <p>₹{payment.amount} ({payment.method}) on {payment.date}</p>
                            {payment.method === 'online' && <p>Txn ID: {payment.transactionId}</p>}
                            {payment.method === 'cash' && <p>Receiver: {payment.receiver}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Customer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  value={newCustomer.contact}
                  onChange={(e) => setNewCustomer({...newCustomer, contact: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agreed Price (₹)</label>
                <input
                  type="number"
                  value={newCustomer.agreedPrice}
                  onChange={(e) => setNewCustomer({...newCustomer, agreedPrice: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
                <input
                  type="number"
                  value={newCustomer.people}
                  onChange={(e) => setNewCustomer({...newCustomer, people: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCustomerForm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={newPayment.method}
                  onChange={(e) => setNewPayment({...newPayment, method: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="online">Online</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              {newPayment.method === 'online' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                  <input
                    type="text"
                    value={newPayment.transactionId}
                    onChange={(e) => setNewPayment({...newPayment, transactionId: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
              {newPayment.method === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name/ID</label>
                  <input
                    type="text"
                    value={newPayment.receiver}
                    onChange={(e) => setNewPayment({...newPayment, receiver: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetailsPage;



// adding customer should send the customer to backend along with the trip id he is beiing added to 
// and there the user will be saved in a customer schema in db
// and the user id ref that it returns will be saved in the trip schema in the arrays
// when ever payment is made it should update the user in the db also 