"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({ tripData, updateTripData,  dateRanges: initialDateRanges }) => {
 const [dateRanges, setDateRanges] = useState(initialDateRanges);
  const [endDate, setEndDate] = useState(null);
   const [days, setDays] = useState(tripData.days || 0);

//   useEffect(() => {
//   // Update parent component with date ranges whenever they change
//   updateTripData('dateRanges', dateRanges);
// }, [dateRanges]);

  // useEffect(() => {
  //   // If we have itinerary data, calculate the required number of days
  //   if (tripData.itinerary && tripData.itinerary.length > 0) {
  //     const requiredDays = tripData.itinerary.length;
  //     setDays(requiredDays);
      
    
  //   }
  // }, [tripData.itinerary]);


 useEffect(() => {
    updateTripData('dateRanges', dateRanges);
  }, [dateRanges]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleStartDateChange = (date, index) => {
    const newDateRanges = [...dateRanges];
    newDateRanges[index].startDate = date;
    
    // If we have a required number of days, set the end date accordingly
    if (days > 0) {
      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + days - 1);
      newDateRanges[index].endDate = newEndDate;
      newDateRanges[index].days = days;
    }
    
    setDateRanges(newDateRanges);
  };

  const handleEndDateChange = (date, index) => {
    const newDateRanges = [...dateRanges];
    newDateRanges[index].endDate = date;
    const calculatedDays = calculateDays(newDateRanges[index].startDate, date);
    
    // Only update the days if this is the first range
    if (index === 0) {
      setDays(calculatedDays);
      // Update trip data with new day count
      updateTripData('days', calculatedDays);
    }
    
    newDateRanges[index].days = calculatedDays;
    setDateRanges(newDateRanges);
  };

  const addDateRange = () => {
    setDateRanges([...dateRanges, { startDate: null, endDate: null }]);
  };

  const removeDateRange = (index) => {
    if (dateRanges.length > 1) {
      const newDateRanges = dateRanges.filter((_, i) => i !== index);
      setDateRanges(newDateRanges);
    }
  };

  return (
     <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Select Trip Dates</h3>
        {dateRanges.map((range, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date {index > 0 && `#${index + 1}`}
              </label>
              <DatePicker
                selected={range.startDate}
                onChange={(date) => handleStartDateChange(date, index)}
                className="w-full p-2 border border-gray-300 rounded-md"
                minDate={new Date()}
                placeholderText="Select start date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date {index > 0 && `#${index + 1}`}
              </label>
              <DatePicker
                selected={range.endDate}
                onChange={(date) => handleEndDateChange(date, index)}
                className="w-full p-2 border border-gray-300 rounded-md"
                minDate={range.startDate}
                placeholderText="Select end date"
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeDateRange(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addDateRange}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Another Date Range
        </button>
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