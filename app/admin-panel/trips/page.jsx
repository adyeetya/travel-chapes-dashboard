"use client";
import { useState } from "react";
import TripForm from "./components/TripForm";

const TripsPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Manage Trips</h1>

      {/* Add Trip Button */}
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        + Add New Trip
      </button>

      {/* Trip Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-4xl">
            <TripForm closeForm={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsPage;

// TODD: on the main page show the list of locations and a propper list ina grid like structure will show different info of the page 
// and the user can click on a trip to go to a dynamic page of the trip where all the details of the trip will shown and can be edited 
// but the main things is have option to add customers who are signing up for the trip now we also need a user shcema which can show a list of previos trips too if they have any
// now when we adding a user we need to identigy on the basis of the mobile number and other fields would be name no of people agreed upon price and payments now payments can be payed in n number of installments
// so we need to have a schema for that too 