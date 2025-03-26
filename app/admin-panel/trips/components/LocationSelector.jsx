import { useState } from "react";

const LocationSelector = ({ tripData, updateTripData, locations }) => {
  const [pickup, setPickup] = useState("");
  const [viaPoints, setViaPoints] = useState([]);
  const [drop, setDrop] = useState("");

  // Handle pickup point change
  const handlePickupChange = (value) => {
    setPickup(value);
    updateTripData("pickup", value);
  };

  // Handle drop point change
  const handleDropChange = (value) => {
    setDrop(value);
    updateTripData("drop", value);
  };

  // Handle via points change (Add/Remove points)
  const handleViaPointChange = (value) => {
    if (viaPoints.includes(value)) {
      const updatedViaPoints = viaPoints.filter((point) => point !== value);
      setViaPoints(updatedViaPoints);
      updateTripData("viaPoints", updatedViaPoints);
    } else {
      const updatedViaPoints = [...viaPoints, value];
      setViaPoints(updatedViaPoints);
      updateTripData("viaPoints", updatedViaPoints);
    }
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
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>

      {/* Via Points (Multiple Selection) */}
      <label className="block mb-2">Via Points (Optional):</label>
      <div className="space-y-2 mb-4">
        {locations.map((location) => (
          <label key={location} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={location}
              checked={viaPoints.includes(location)}
              onChange={() => handleViaPointChange(location)}
              className="w-4 h-4"
            />
            <span>{location}</span>
          </label>
        ))}
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
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
