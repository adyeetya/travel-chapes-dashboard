import { useState } from "react";

const VehicleSelector = ({ tripData, updateTripData, vehicles }) => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const handleVehicleChange = (vehicle) => {
    const updatedVehicles = selectedVehicles.includes(vehicle)
      ? selectedVehicles.filter((v) => v !== vehicle)
      : [...selectedVehicles, vehicle];

    setSelectedVehicles(updatedVehicles);
    updateTripData("vehicles", updatedVehicles);
  };

  return (
    <div>
      <h3 className="text-xl mb-4">Select Vehicles</h3>
      <div className="space-y-2">
        {vehicles.map((vehicle) => (
          <label key={vehicle} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={vehicle}
              checked={selectedVehicles.includes(vehicle)}
              onChange={() => handleVehicleChange(vehicle)}
              className="w-4 h-4"
            />
            <span>{vehicle}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default VehicleSelector;
