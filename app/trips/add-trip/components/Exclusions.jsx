"use client";
import RichTextEditor from "./RichTextEditor";

const Exclusions = ({ tripPlan, setTripPlan }) => {
    const handleArrayChange = (e, index) => {
        const { name, value } = e.target;
        const updatedArray = [...tripPlan.exclusions];
        updatedArray[index][name] = value;
        setTripPlan({ ...tripPlan, exclusions: updatedArray });
    };

    const handleDescriptionChange = (index, html) => {
        const updatedArray = [...tripPlan.exclusions];
        updatedArray[index].description = html;
        setTripPlan({ ...tripPlan, exclusions: updatedArray });
    };

    const addItem = () => {
        setTripPlan({
            ...tripPlan,
            exclusions: [...tripPlan.exclusions, { title: '', description: '' }]
        });
    };

    const removeItem = (index) => {
        const updatedArray = tripPlan.exclusions.filter((_, i) => i !== index);
        setTripPlan({ ...tripPlan, exclusions: updatedArray });
    };

    return (
        <section className='bg-gray-50 p-6 rounded-lg'>
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Exclusions</h2>
                {tripPlan.exclusions.map((exclusion, index) => (
                    <div key={index} className="space-y-4 mb-6">
                        <input
                            type="text"
                            name="title"
                            value={exclusion.title}
                            onChange={(e) => handleArrayChange(e, index)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Title"
                        />
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <RichTextEditor
                                content={exclusion.description}
                                onChange={(html) => handleDescriptionChange(index, html)}
                            />
                        </div>
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
                    + Add Exclusion
                </button>
            </div>
        </section>
    );
};

export default Exclusions;