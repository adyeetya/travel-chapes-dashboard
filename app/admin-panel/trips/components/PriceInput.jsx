import { useState, useEffect } from "react";

const PriceInput = ({ tripData, updateTripData, vehicles }) => {
  const [prices, setPrices] = useState({});
  const [gst, setGst] = useState(tripData.gst || 18);

  // Get only vehicles that are included in this trip
  const tripVehicles = vehicles.filter(vehicle => 
    tripData.vehicles?.includes(vehicle._id)
  );

  // Initialize prices for trip vehicles
  useEffect(() => {
    const initialPrices = {};
    tripVehicles.forEach(vehicle => {
      const vehicleType = vehicle.type.toLowerCase();
      initialPrices[vehicleType] = tripData.pricing?.[vehicleType] || {
        single: 0,
        double: 0,
        triple: 0
      };
    });
    setPrices(initialPrices);
  }, []);

  const handlePriceChange = (vehicleType, priceType, value) => {
    const updatedPrices = {
      ...prices,
      [vehicleType]: {
        ...prices[vehicleType],
        [priceType]: Number(value) || 0,
      },
    };
    setPrices(updatedPrices);
    updateTripData("pricing", updatedPrices);
  };

  const handleGSTChange = (value) => {
    const gstValue = Number(value) || 0;
    setGst(gstValue);
    updateTripData("gst", gstValue);
  };

  return (
    <div>
      <h3 className="text-xl mb-4">Set Pricing & GST</h3>

      {tripVehicles.map((vehicle) => {
        const vehicleType = vehicle.type.toLowerCase();
        return (
          <div key={vehicle._id} className="mb-6">
            <h4 className="text-lg mb-2">{vehicle.name} Pricing:</h4>
            {["single", "double", "triple"].map((type) => (
              <div key={type} className="mb-2 flex items-center gap-4">
                <label className="w-24 capitalize">{type} User:</label>
                <input
                  type="number"
                  value={prices[vehicleType]?.[type] || 0}
                  onChange={(e) =>
                    handlePriceChange(vehicleType, type, e.target.value)
                  }
                  placeholder="Enter price"
                  className="p-2 border rounded-md"
                  min="0"
                />
              </div>
            ))}
          </div>
        );
      })}

      <div className="mt-4">
        <label className="block mb-2">GST (%):</label>
        <input
          type="number"
          value={gst}
          onChange={(e) => handleGSTChange(e.target.value)}
          placeholder="Enter GST"
          className="p-2 border rounded-md w-full"
          min="0"
          max="100"
        />
      </div>
    </div>
  );
};

export default PriceInput;