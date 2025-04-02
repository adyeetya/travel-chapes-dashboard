"use client";
import { useState } from "react";

export const AddPaymentModal = ({ 
  isOpen, 
  onClose, 
  payment,
  setPayment,
  onSubmit, 
  loading 
}) => {
//   const [payment, setPayment] = useState({
//     amount: 0,
//     method: "online",
//     transactionId: "",
//     receiver: ""
//   });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setPayment(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...payment,
      date: new Date().toISOString().split("T")[0],
    });
    setPayment({
      amount: 0,
      method: "online",
      transactionId: "",
      receiver: ""
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Add New Payment</h3>
        </div>
        <div className="px-6 py-4 space-y-4">
          <FormField
            label="Amount (₹)"
            id="amount"
            type="number"
            min="0"
            step="100"
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
            />
          )}
          
          {(payment.method === "cash" || payment.method === "cheque") && (
            <FormField
              label="Received By"
              id="receiver"
              value={payment.receiver}
              onChange={(value) => handleChange("receiver", value)}
            />
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <CancelButton onClick={onClose} />
          <SubmitButton 
            onClick={handleSubmit} 
            loading={loading} 
            text="Record Payment" 
          />
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, id, type = "text", value, onChange, ...props }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  );
  
  const CancelButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Cancel
    </button>
  );
  
  const SubmitButton = ({ onClick, loading, text }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {loading ? "Processing..." : text}
    </button>
  );

