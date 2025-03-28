const BasicInfo = ({ tripPlan, setTripPlan }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripPlan({ ...tripPlan, [name]: value });
    };

    return (
        <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                    <input
                        type="text"
                        name="metaTitle"
                        value={tripPlan.metaTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <textarea
                        name="metaDescription"
                        value={tripPlan.metaDescription}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        rows="3"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                    <input
                        type="text"
                        name="headline"
                        value={tripPlan.headline}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={tripPlan.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        rows="4"
                    />
                </div>
                {['id', 'name', 'title', 'route', 'ageGroup', 'minPrice'].map((field) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
                            {field.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                            type="text"
                            name={field}
                            value={tripPlan[field]}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BasicInfo;