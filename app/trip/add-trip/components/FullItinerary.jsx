const FullItinerary = ({ tripPlan, setTripPlan }) => {
    const handleArrayChange = (e, index) => {
        const { name, value } = e.target;
        const updatedArray = [...tripPlan.fullItinerary];
        updatedArray[index][name] = value;
        setTripPlan({ ...tripPlan, fullItinerary: updatedArray });
    };

    const addItem = () => {
        setTripPlan({
            ...tripPlan,
            fullItinerary: [...tripPlan.fullItinerary, { day: '', title: '', description: '' }]
        });
    };

    const removeItem = (index) => {
        const updatedArray = tripPlan.fullItinerary.filter((_, i) => i !== index);
        setTripPlan({ ...tripPlan, fullItinerary: updatedArray });
    };

    return (
        <section className='bg-gray-50 p-6 rounded-lg'>
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Full Itinerary</h2>
                {tripPlan.fullItinerary.map((itinerary, index) => (
                    <div key={index} className="space-y-4 mb-4">
                        <input
                            type="text"
                            name="day"
                            value={itinerary.day}
                            onChange={(e) => handleArrayChange(e, index)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Day"
                        />
                        <input
                            type="text"
                            name="title"
                            value={itinerary.title}
                            onChange={(e) => handleArrayChange(e, index)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Title"
                        />
                        <textarea
                            name="description"
                            value={itinerary.description}
                            onChange={(e) => handleArrayChange(e, index)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Description"
                            rows="2"
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addItem}
                    className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                    + Add Full Itinerary
                </button>
            </div>
        </section>
    );
};

export default FullItinerary;