import { useState } from "react";

const LocationSelector = ({ tripData, updateTripData, locations }) => {
  const [pickup, setPickup] = useState("");
  const [viaPoints, setViaPoints] = useState('');
  const [drop, setDrop] = useState("");

  // Handle pickup point change
  const handlePickupChange = (value) => {
    setPickup(value);
    updateTripData("pickup", value);
  };

  // Handle drop point change
  const handleDropChange = (value) => {
    setDrop(value);
    updateTripData("locationId", value);
  };

  // Handle via points change (Add/Remove points)
  const handleViaPointChange = (value) => {
    setViaPoints(value);
    updateTripData("viaPoints", value);
  };

  return (
    <div>
      <h3 className="text-xl mb-4">Select Locations</h3>

      {/* Pickup Point */}
      <label className="block mb-2">Pickup Point:</label>
      <select
        value={pickup}
        onChange={(e) => handlePickupChange(e.target.value)}
        className="p-2 border rounded-md w-full mb-4"
      >
        <option value="">Select Pickup Point</option>
        {locations.map((location) => (
          <option key={location._id} value={location.city}>
            {location.city}
          </option>
        ))}
      </select>

      {/* Via Points (Multiple Selection) */}
      
      <div className="space-y-2 mb-4">

      <label className="block mb-2">Via Points (Optional):</label>
      <input
        type="text"
        value={viaPoints}
        onChange={(e) => handleViaPointChange(e.target.value)}
        placeholder="Enter via points separated by commas"
        className="p-2 border rounded-md w-full mb-4"
      />


      </div>

      {/* Drop Point */}
      <label className="block mb-2">Drop Point:</label>
      <select
        value={drop}
        onChange={(e) => handleDropChange(e.target.value)}
        className="p-2 border rounded-md w-full"
      >
        <option value="">Select Drop Point</option>
        {locations.map((location) => (
          <option key={location._id} value={location._id}>
            {location.city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
