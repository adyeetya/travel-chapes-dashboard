const Categories = ({ tripPlan, setTripPlan }) => {
    const addCategory = () => {
        setTripPlan({ ...tripPlan, category: [...tripPlan.category, ''] });
    };

    const updateCategory = (index, value) => {
        const updatedCategories = [...tripPlan.category];
        updatedCategories[index] = value;
        setTripPlan({ ...tripPlan, category: updatedCategories });
    };

    const removeCategory = (index) => {
        const updatedCategories = tripPlan.category.filter((_, i) => i !== index);
        setTripPlan({ ...tripPlan, category: updatedCategories });
    };

    return (
        <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Categories</h2>
            <div className="space-y-4">
                {tripPlan.category.map((category, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => updateCategory(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addCategory}
                    className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                    + Add Category
                </button>
            </div>
        </section>
    );
};

export default Categories;