"use client";

export const CustomersSection = ({ 
  customers, 
  onAddCustomer, 
  onAddPayment 
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
        <button 
          onClick={onAddCustomer}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          + Add Customer
        </button>
      </div>
      
      {customers.length === 0 ? (
        <EmptyCustomersState onAddCustomer={onAddCustomer} />
      ) : (
        <CustomersTable 
          customers={customers} 
          onAddPayment={onAddPayment} 
        />
      )}
    </div>
  );
};

const EmptyCustomersState = ({ onAddCustomer }) => (
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
    <h3 className="mt-2 text-sm font-medium text-gray-900">No customers</h3>
    <p className="mt-1 text-sm text-gray-500">
      Get started by adding a new customer.
    </p>
    <div className="mt-6">
      <button
        onClick={onAddCustomer}
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
);

const CustomersTable = ({ customers, onAddPayment }) => {
  const calculatePaymentSummary = (customer) => {
    const totalPaid =
      customer.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const balance = Math.max(0, customer.agreedPrice - totalPaid);
    return { totalPaid, balance };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Contact</TableHeader>
            <TableHeader>People</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Paid</TableHeader>
            <TableHeader>Balance</TableHeader>
            <TableHeader align="right">Actions</TableHeader>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer) => (
            <CustomerRow 
              key={customer._id} 
              customer={customer} 
              onAddPayment={onAddPayment}
              calculatePaymentSummary={calculatePaymentSummary}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHeader = ({ children, align = "left" }) => (
  <th
    scope="col"
    className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}
  >
    {children}
  </th>
);

const CustomerRow = ({ customer, onAddPayment, calculatePaymentSummary }) => {
  const { totalPaid, balance } = calculatePaymentSummary(customer);
  
  return (
    <tr className="hover:bg-gray-50">
      <TableCell>{customer.name}</TableCell>
      <TableCell>{customer.contact}</TableCell>
      <TableCell>{customer.numOfPeople}</TableCell>
      <TableCell>₹{customer.agreedPrice.toLocaleString()}</TableCell>
      <TableCell>₹{totalPaid.toLocaleString()}</TableCell>
      <TableCell className={balance > 0 ? "text-red-600" : "text-green-600"}>
        ₹{balance.toLocaleString()}
      </TableCell>
      <TableCell align="right">
        <button
          onClick={() => onAddPayment(customer._id)}
          className="text-blue-600 hover:text-blue-900"
        >
          Add Payment
        </button>
      </TableCell>
    </tr>
  );
};

const TableCell = ({ children, className = "", align = "left" }) => (
  <td
    className={`px-6 py-4 whitespace-nowrap text-sm ${className} text-${align}`}
  >
    {children}
  </td>
);