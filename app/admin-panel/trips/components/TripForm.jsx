"use client";
import { useEffect, useState } from "react";
import LocationSelector from "./LocationSelector";
import Calendar from "./Calendar";
import VehicleSelector from "./VehicleSelector";
import HotelSelector from "./HotelSelector";
import PriceInput from "./PriceInput";
import MealSelector from "./MealSelector";
import DayItineraryEditor from "./DayItineraryEditor";
import { ServerUrl } from "@/app/config";
const TripForm = ({ closeForm, onSave, planIds, locations, hotels, vehicles }) => {
  const [step, setStep] = useState(1);
  const [dateRanges, setDateRanges] = useState([{
    startDate: null,
    endDate: null,
    days: 0
  }]);
  const [tripData, setTripData] = useState({
    slug: "",
    locationId: "",
    pickup: "",
    viaPoints: "",
    startDate: "",
    endDate: "",
    days: 0,
    itinerary: [],
    vehicles: [],
    stays: [],
    meals: [],
    pricing: { car: {}, bus: {} },
    gst: 18,
  });



  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const updateTripData = (field, value) => {
    if (field === 'dateRanges') {
      setDateRanges(value);
      // Also update the main tripData with the first date range for backward compatibility
      if (value.length > 0 && value[0].startDate && value[0].endDate) {
        setTripData(prev => ({
          ...prev,
          startDate: value[0].startDate,
          endDate: value[0].endDate,
          days: calculateDays(value[0].startDate, value[0].endDate)
        }));
      }
    } else {
      setTripData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleItineraryChange = (dayIndex, content) => {
    setTripData((prev) => {
      const newItinerary = [...prev.itinerary];
      newItinerary[dayIndex] = content;
      return { ...prev, itinerary: newItinerary };
    });
  };

  const handleIdChange = async (e) => {
    const selectedSlug = e.target.value;
    setTripData(prev => ({ ...prev, slug: selectedSlug }));

    if (selectedSlug) {
      try {
        const response = await fetch(`${ServerUrl}/tripPlans/getfullItinerary?slug=${selectedSlug}`);
        const data = await response.json();

        if (data.responseCode === 200 && data.result && data.result.length > 0) {
          const tripPlan = data.result[0];
          const fullItinerary = tripPlan.fullItinerary || [];
          const requiredDays = fullItinerary.length;
          // Update days and itinerary based on the fetched data
          setTripData(prev => ({
            ...prev,
            days: fullItinerary.length,
            itinerary: fullItinerary.map(item => item.description || '')
          }));

          // Update date ranges with the new day count
        setDateRanges(prevRanges => 
          prevRanges.map(range => {
            if (range.startDate) {
              const newEndDate = new Date(range.startDate);
              newEndDate.setDate(newEndDate.getDate() + requiredDays - 1);
              return { 
                ...range, 
                endDate: newEndDate,
                days: requiredDays
              };
            }
            return range;
          })
        );
        }
      } catch (error) {
        console.error('Error fetching itinerary:', error);
      }
    }
  };
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

const handleSubmit = async () => {
  // Filter out any incomplete date ranges
  console.log('Submitting dateRanges:', dateRanges);
  const validDateRanges = dateRanges.filter(
    range => range.startDate && range.endDate && range.days
  );

  if (validDateRanges.length === 0) {
    // Fallback to the main tripData if no valid ranges
    await onSave(tripData);
    return;
  }

  // Create a trip for each date range
  for (const range of validDateRanges) {
    const tripForRange = {
      ...tripData,
      startDate: range.startDate,
      endDate: range.endDate,
      days: range.days
    };
    console.log('Saving trip for range:', tripForRange);
    await onSave(tripForRange);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Create New Trip</h2>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${step >= stepNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {stepNumber}
                </div>
                <span className="text-xs mt-1 text-gray-500">
                  {stepNumber === 1 && "Location"}
                  {stepNumber === 2 && "Dates"}
                  {stepNumber === 3 && "Itinerary"}
                  {stepNumber === 4 && "Services"}
                  {stepNumber === 5 && "Pricing"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Trip Plan
                </label>
                <select
                  value={tripData.slug}
                  onChange={handleIdChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a trip ID</option>
                  {planIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>

              <LocationSelector
                tripData={tripData}
                updateTripData={updateTripData}
                locations={locations}
              />
            </div>
          )}

          {step === 2 && (
            <Calendar tripData={tripData}
              updateTripData={updateTripData}
              dateRanges={dateRanges} />
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Add Itinerary Details
              </h3>
              <div className="space-y-6">
                {Array.from({ length: tripData.days }).map((_, index) => (
                  <DayItineraryEditor
                    key={index}
                    day={index + 1}
                    content={tripData.itinerary[index] || ''}
                    onContentChange={handleItineraryChange}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <VehicleSelector
                tripData={tripData}
                updateTripData={updateTripData}
                vehicles={vehicles}
              />
              <HotelSelector
                tripData={tripData}
                updateTripData={updateTripData}
                hotels={hotels}
              />
              <MealSelector
                tripData={tripData}
                updateTripData={updateTripData}
              />
            </div>
          )}

          {step === 5 && (
            <PriceInput tripData={tripData} updateTripData={updateTripData} vehicles={vehicles} />
          )}
        </div>

        {/* Action buttons */}
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={closeForm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            Cancel
          </button>

          <div className="space-x-3">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition-colors"
              >
                Back
              </button>
            )}

            {step === 5 ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Submit {dateRanges.length > 1 ? `${dateRanges.length} Trips` : 'Trip'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripForm;
