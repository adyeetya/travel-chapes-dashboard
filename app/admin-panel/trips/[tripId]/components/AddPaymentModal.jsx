"use client";
import { useState } from "react";

export const AddPaymentModal = ({ 
  isOpen, 
  onClose, 
  booking, // Pass the entire booking object
  payment,
  setPayment,
  onSubmit, 
  loading 
}) => {
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setPayment(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Calculate remaining balance
    const { balance } = calculatePaymentSummary(booking);
    
    // Validate payment amount
    if (payment.amount <= 0) {
      alert("Payment amount must be positive");
      return;
    }

    if (payment.amount > balance) {
      alert(`Payment cannot exceed remaining balance of ₹${balance}`);
      return;
    }

    const paymentData = {
      ...payment,
      status: "paid", // Default to paid when manually recording
      date: new Date(),
      receiver: payment.receiver || "Admin" // Default receiver if not specified
    };

    await onSubmit(paymentData);
    
    // Reset form if submission was successful
    setPayment({
      amount: Math.max(0, balance - payment.amount), // Suggest remaining balance
      method: "online",
      transactionId: "",
      receiver: ""
    });
  };

  const calculatePaymentSummary = (booking) => {
    const totalPaid = booking.payments?.reduce(
      (sum, payment) => payment.status === 'paid' ? sum + payment.amount : sum, 
      0
    ) || 0;
    
    const balance = Math.max(0, booking.agreedPrice - totalPaid);
    
    return { totalPaid, balance };
  };

  const { balance } = calculatePaymentSummary(booking);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Record Payment</h3>
          <p className="text-sm text-gray-500 mt-1">
            Remaining balance: ₹{balance}
          </p>
        </div>
        
        <div className="px-6 py-4 space-y-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              Booking Reference: {booking._id.slice(-6).toUpperCase()}
            </p>
            <p className="text-sm text-blue-800 mt-1">
              Customer: {booking.userId?.name || "N/A"}
            </p>
          </div>
          
          <FormField
            label="Amount (₹)"
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            max={balance}
            value={payment.amount}
            onChange={(value) => handleChange("amount", Number(value))}
          />
          
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              id="method"
              value={payment.method}
              onChange={(e) => handleChange("method", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="online">Online Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          
          {payment.method === "online" && (
            <FormField
              label="Transaction ID"
              id="transactionId"
              value={payment.transactionId}
              onChange={(value) => handleChange("transactionId", value)}
              required
            />
          )}
          
          <FormField
            label={payment.method === "cash" ? "Received By" : "Processed By"}
            id="receiver"
            value={payment.receiver}
            onChange={(value) => handleChange("receiver", value)}
          />
          
          <FormField
            label="Notes"
            id="notes"
            type="textarea"
            value={payment.notes || ""}
            onChange={(value) => handleChange("notes", value)}
            optional
          />
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <CancelButton onClick={onClose} />
          <SubmitButton 
            onClick={handleSubmit} 
            loading={loading} 
            text="Record Payment" 
            disabled={!payment.amount || payment.amount <= 0}
          />
        </div>
      </div>
    </div>
  );
};

// Enhanced SubmitButton with disabled state
const SubmitButton = ({ onClick, loading, text, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
      disabled ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
  >
    {loading ? "Processing..." : text}
  </button>
);

// Textarea version of FormField
const FormField = ({ label, id, type = "text", value, onChange, optional = false, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {optional && <span className="text-gray-500">(optional)</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        rows={3}
        {...props}
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    )}
  </div>
);

// CancelButton remains the same
const CancelButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    Cancel
  </button>
);