"use client";
import RichTextEditor from "./RichTextEditor";

const ImportantPoints = ({ tripPlan, setTripPlan }) => {
    const handleArrayChange = (e, index) => {
        const { name, value } = e.target;
        const updatedArray = [...tripPlan.importantPoints];
        updatedArray[index][name] = value;
        setTripPlan({ ...tripPlan, importantPoints: updatedArray });
    };

    const handleDescriptionChange = (index, html) => {
        const updatedArray = [...tripPlan.importantPoints];
        updatedArray[index].description = html;
        setTripPlan({ ...tripPlan, importantPoints: updatedArray });
    };

    const addItem = () => {
        setTripPlan({
            ...tripPlan,
            importantPoints: [...tripPlan.importantPoints, { title: '', description: '' }]
        });
    };

    const removeItem = (index) => {
        const updatedArray = tripPlan.importantPoints.filter((_, i) => i !== index);
        setTripPlan({ ...tripPlan, importantPoints: updatedArray });
    };

    return (
        <section className='bg-gray-50 p-6 rounded-lg'>
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Important Points</h2>
                {tripPlan.importantPoints.map((point, index) => (
                    <div key={index} className="space-y-4 mb-6">
                        <input
                            type="text"
                            name="title"
                            value={point.title}
                            onChange={(e) => handleArrayChange(e, index)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Title"
                        />
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <RichTextEditor
                                content={point.description}
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
                    + Add Important Point
                </button>
            </div>
        </section>
    );
};

export default ImportantPoints;