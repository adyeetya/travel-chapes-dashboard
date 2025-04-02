"use client";

export const AddCustomerModal = ({ 
  isOpen, 
  onClose, 
  customerData, 
  onCustomerChange, 
  onSubmit, 
  loading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Add New Customer</h3>
        </div>
        <div className="px-6 py-4 space-y-4">
          <FormField
            label="Full Name"
            id="name"
            value={customerData.name}
            onChange={(value) => onCustomerChange("name", value)}
          />
          <FormField
            label="Contact Number"
            id="contact"
            value={customerData.contact}
            onChange={(value) => onCustomerChange("contact", value)}
          />
          <FormField
            label="Number of People"
            id="numOfPeople"
            type="number"
            min="1"
            value={customerData.numOfPeople}
            onChange={(value) => onCustomerChange("numOfPeople", Number(value))}
          />
          <FormField
            label="Agreed Price (₹)"
            id="price"
            type="number"
            min="0"
            step="100"
            value={customerData.agreedPrice}
            onChange={(value) => onCustomerChange("agreedPrice", Number(value))}
          />
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <CancelButton onClick={onClose} />
          <SubmitButton 
            onClick={onSubmit} 
            loading={loading} 
            text="Add Customer" 
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