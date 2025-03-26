import { useState } from "react";

const MealSelector = ({ tripData, updateTripData }) => {
  const mealOptions = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const [selectedMeals, setSelectedMeals] = useState([]);

  const handleMealChange = (meal) => {
    const updatedMeals = selectedMeals.includes(meal)
      ? selectedMeals.filter((m) => m !== meal)
      : [...selectedMeals, meal];

    setSelectedMeals(updatedMeals);
    updateTripData("meals", updatedMeals);
  };

  return (
    <div>
      <h3 className="text-xl mb-4">Select Included Meals</h3>
      <div className="space-y-2">
        {mealOptions.map((meal) => (
          <label key={meal} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={meal}
              checked={selectedMeals.includes(meal)}
              onChange={() => handleMealChange(meal)}
              className="w-4 h-4"
            />
            <span>{meal}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MealSelector;
