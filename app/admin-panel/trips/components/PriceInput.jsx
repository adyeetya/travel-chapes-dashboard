import { useState } from "react";

const PriceInput = ({ tripData, updateTripData }) => {
  const [prices, setPrices] = useState({
    car: { single: 0, double: 0, triple: 0 },
    bus: { single: 0, double: 0, triple: 0 },
    gst: 0,
  });

  const handlePriceChange = (vehicle, type, value) => {
    const updatedPrices = {
      ...prices,
      [vehicle]: {
        ...prices[vehicle],
        [type]: value,
      },
    };
    setPrices(updatedPrices);
    updateTripData("pricing", updatedPrices);
  };

  const handleGSTChange = (value) => {
    const updatedPrices = { ...prices, gst: value };
    setPrices(updatedPrices);
    updateTripData("pricing", updatedPrices);
  };

  return (
    <div>
      <h3 className="text-xl mb-4">Set Pricing & GST</h3>

      {["car", "bus"].map((vehicle) => (
        <div key={vehicle} className="mb-6">
          <h4 className="text-lg mb-2 capitalize">{vehicle} Pricing:</h4>
          {["single", "double", "triple"].map((type) => (
            <div key={type} className="mb-2 flex items-center gap-4">
              <label className="w-24 capitalize">{type} User:</label>
              <input
                type="number"
                value={prices[vehicle][type]}
                onChange={(e) =>
                  handlePriceChange(vehicle, type, Number(e.target.value))
                }
                placeholder="Enter price"
                className="p-2 border rounded-md"
              />
            </div>
          ))}
        </div>
      ))}

      <div className="mt-4">
        <label className="block mb-2">GST (%):</label>
        <input
          type="number"
          value={prices.gst}
          onChange={(e) => handleGSTChange(Number(e.target.value))}
          placeholder="Enter GST"
          className="p-2 border rounded-md w-full"
        />
      </div>
    </div>
  );
};

export default PriceInput;
