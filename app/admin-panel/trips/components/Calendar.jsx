import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({ tripData, updateTripData }) => {
  const handleDateChange = (date, field) => {
    updateTripData(field, date);

    if (field === "endDate" && tripData.startDate) {
      const days = Math.ceil(
        (date - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)
      );
      updateTripData("days", days + 1);
    }
  };

  return (
    <div>
      <label>Start Date:</label>
      <DatePicker
        selected={tripData.startDate}
        onChange={(date) => handleDateChange(date, "startDate")}
        className="p-2 border"
      />

      <label className="ml-4">End Date:</label>
      <DatePicker
        selected={tripData.endDate}
        onChange={(date) => handleDateChange(date, "endDate")}
        className="p-2 border"
      />

      {tripData.days > 0 && <p>Total Days: {tripData.days}</p>}
    </div>
  );
};

export default Calendar;
