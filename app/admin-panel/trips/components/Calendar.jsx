import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({ tripData, updateTripData }) => {
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    updateTripData("startDate", start);
    updateTripData("endDate", end);

    if (start && end) {
      const days = Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
      );
      updateTripData("days", days + 1);
    }
  };

  return (
    <div>
      <label>Trip Dates:</label>
      <DatePicker
        selectsRange
        startDate={tripData.startDate}
        endDate={tripData.endDate}
        onChange={handleDateChange}
        className="p-2 border"
        isClearable
        placeholderText="Select date range"
      />

      {tripData.days > 0 && (
        <p className="mt-2">Total Days: {tripData.days}</p>
      )}
    </div>
  );
};

export default Calendar;