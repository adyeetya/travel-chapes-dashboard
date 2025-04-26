'use client'
import {useState} from 'react'
export const AddCustomerModal = ({ 
  isOpen, 
  onClose, 
  tripId,
  onSubmit, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    customer: { name: "", contact: "" },
    booking: {
      tripId,
      noOfPeople: 1,
      agreedPrice: 0,
      specialRequirements: "",
      payment: { amount: 0, method: "online" }
    }
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePaymentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      booking: {
        ...prev.booking,
        payment: {
          ...prev.booking.payment,
          [field]: value
        }
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Add New Customer & Booking</h3>
        </div>
        
        <div className="px-6 py-4 space-y-4">
          <h4 className="font-medium text-gray-700">Customer Details</h4>
          <FormField
            label="Full Name"
            value={formData.customer.name}
            onChange={(value) => handleChange('customer', 'name', value)}
          />
          <FormField
            label="Contact Number"
            value={formData.customer.contact}
            onChange={(value) => handleChange('customer', 'contact', value)}
            placeholder="+91XXXXXXXXXX"
          />
          
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-700">Booking Details</h4>
            <FormField
              label="Number of People"
              type="number"
              min="1"
              value={formData.booking.noOfPeople}
              onChange={(value) => handleChange('booking', 'noOfPeople', Number(value))}
            />
            <FormField
              label="Agreed Price (₹)"
              type="number"
              min="0"
              step="100"
              value={formData.booking.agreedPrice}
              onChange={(value) => handleChange('booking', 'agreedPrice', Number(value))}
            />
            <FormField
              label="Special Requirements"
              value={formData.booking.specialRequirements}
              onChange={(value) => handleChange('booking', 'specialRequirements', value)}
              optional
            />
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-700">Initial Payment</h4>
            <FormField
              label="Amount (₹)"
              type="number"
              min="0"
              value={formData.booking.payment.amount}
              onChange={(value) => handlePaymentChange('amount', Number(value))}
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={formData.booking.payment.method}
                onChange={(e) => handlePaymentChange('method', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="online">Online</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <CancelButton onClick={onClose} />
          <SubmitButton 
            onClick={() => onSubmit(formData)} 
            loading={loading} 
            text="Create Booking" 
          />
        </div>
      </div>
    </div>
  );
};