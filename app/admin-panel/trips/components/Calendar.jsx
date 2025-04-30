"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({ tripData, updateTripData }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [days, setDays] = useState(0);

  useEffect(() => {
    // If we have itinerary data, calculate the required number of days
    if (tripData.itinerary && tripData.itinerary.length > 0) {
      const requiredDays = tripData.itinerary.length;
      setDays(requiredDays);
      
      // If we have a start date but no end date, or if the current days don't match
      if (startDate && (!endDate || calculateDays(startDate, endDate) !== requiredDays)) {
        const newEndDate = new Date(startDate);
        newEndDate.setDate(newEndDate.getDate() + requiredDays - 1);
        setEndDate(newEndDate);
        updateTripData('endDate', newEndDate);
      }
    }
  }, [tripData.itinerary, startDate]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    updateTripData('startDate', date);
    
    // If we have a required number of days, set the end date accordingly
    if (days > 0) {
      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + days - 1);
      setEndDate(newEndDate);
      updateTripData('endDate', newEndDate);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    updateTripData('endDate', date);
    
    const calculatedDays = calculateDays(startDate, date);
    setDays(calculatedDays);
    updateTripData('days', calculatedDays);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Select Trip Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              minDate={new Date()}
              placeholderText="Select start date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              minDate={startDate}
              placeholderText="Select end date"
            />
          </div>
        </div>
        {days > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Trip Duration: {days} {days === 1 ? 'day' : 'days'}
          </p>
        )}
        {tripData.itinerary && tripData.itinerary.length > 0 && days !== tripData.itinerary.length && (
          <p className="mt-2 text-sm text-red-600">
            Note: The selected dates should cover {tripData.itinerary.length} days to match the itinerary
          </p>
        )}
      </div>
    </div>
  );
};

export default Calendar;