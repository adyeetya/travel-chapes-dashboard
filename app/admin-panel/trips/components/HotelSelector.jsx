import { useState } from "react";

const HotelSelector = ({ tripData, updateTripData, hotels }) => {
  const [selectedHotels, setSelectedHotels] = useState(
    Array(tripData.days).fill("")
  );

  const handleHotelChange = (index, value) => {
    const updatedHotels = [...selectedHotels];
    updatedHotels[index] = value;
    setSelectedHotels(updatedHotels);
    updateTripData("stays", updatedHotels);
  };

  return (
    <div>
      <h3 className="text-xl mb-4">Select Hotels (Optional)</h3>
      {Array.from({ length: tripData.days }, (_, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-1">Day {index + 1} Hotel:</label>
          <select
            value={selectedHotels[index]}
            onChange={(e) => handleHotelChange(index, e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">No Hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default HotelSelector;
