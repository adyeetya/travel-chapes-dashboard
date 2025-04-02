'use client'
import { useState } from 'react';

const TripPlanForm = () => {
    const [tripPlan, setTripPlan] = useState({
        id: '',
        name: '',
        title: '',
        route: '',
        category: [],
        ageGroup: '',
        minPrice: '',
        banners: { phone: '', web: '' },
        images: [],
        metaTitle: '',
        metaDescription: '',
        headline: '',
        description: '',
        fullItinerary: [],
        inclusions: [],
        exclusions: [],
        importantPoints: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripPlan({ ...tripPlan, [name]: value });
    };

    const handleArrayChange = (e, arrayName, index) => {
        const { name, value } = e.target;
        const updatedArray = [...tripPlan[arrayName]];
        updatedArray[index][name] = value;
        setTripPlan({ ...tripPlan, [arrayName]: updatedArray });
    };

    const addArrayItem = (arrayName, defaultItem) => {
        setTripPlan({ ...tripPlan, [arrayName]: [...tripPlan[arrayName], defaultItem] });
    };

    const removeArrayItem = (arrayName, index) => {
        const updatedArray = tripPlan[arrayName].filter((_, i) => i !== index);
        setTripPlan({ ...tripPlan, [arrayName]: updatedArray });
    };

    const handleBannerUpload = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
    
        setTripPlan((prev) => ({
            ...prev,
            banners: {
                ...prev.banners,
                [field]: file,
            },
        }));
    };
    
    const handleImagesUpload = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
    
        setTripPlan((prev) => ({
            ...prev,
            images: [...prev.images, ...Array.from(files)],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', tripPlan);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Create Trip Plan</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Section */}
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

                        {/* Category Section */}
                        <section className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Categories</h2>
                            <div className="space-y-4">
                                {tripPlan.category.map((category, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) => {
                                                const updatedCategories = [...tripPlan.category];
                                                updatedCategories[index] = e.target.value;
                                                setTripPlan({...tripPlan, category: updatedCategories});
                                            }}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('category', index)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('category', '')}
                                    className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    + Add Category
                                </button>
                            </div>
                        </section>

                        {/* full iteneries */}
                        <section className='bg-gray-50 p-6 rounded-lg'>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Full Itinerary</h2>
                                {tripPlan.fullItinerary.map((itinerary, index) => (
                                    <div key={index} className="space-y-4 mb-4">
                                        <input
                                            type="text"
                                            name="day"
                                            value={itinerary.day}
                                            onChange={(e) => handleArrayChange(e, 'fullItinerary', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Day"
                                        />
                                        <input
                                            type="text"
                                            name="title"
                                            value={itinerary.title}
                                            onChange={(e) => handleArrayChange(e, 'fullItinerary', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Title"
                                        />
                                        <textarea
                                            name="description"
                                            value={itinerary.description}
                                            onChange={(e) => handleArrayChange(e, 'fullItinerary', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Description"
                                            rows="2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('fullItinerary', index)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('fullItinerary', { day: '', title: '', description: '' })}
                                    className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    + Add Full Itinerary
                                </button>
                            </div>
                        </section>

                        {/* Banners Section */}
                        <section className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Banners</h2>
                            <div className="space-y-4">
                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Banner Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleBannerUpload(e, 'phone')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                                </div>
                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Web Banner Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleBannerUpload(e, 'web')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                                </div>
                            </div>
                        </section>
                        
                        {/* inclusions */}
                        <section className='bg-gray-50 p-6 rounded-lg'>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Inclusions</h2>
                                {tripPlan.inclusions.map((inclusion, index) => (
                                    <div key={index} className="space-y-4 mb-4">
                                        <input
                                            type="text"
                                            name="title"
                                            value={inclusion.title}
                                            onChange={(e) => handleArrayChange(e, 'inclusions', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Title"
                                        />
                                        <textarea
                                            name="description"
                                            value={inclusion.description}
                                            onChange={(e) => handleArrayChange(e, 'inclusions', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Description"
                                            rows="2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('inclusions', index)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('inclusions', { title: '', description: '' })}
                                    className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    + Add Inclusion
                                </button>
                            </div>
                        </section>
                        
                        {/* exclusions */}
                        <section className='bg-gray-50 p-6 rounded-lg'>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Exclusions</h2>
                                {tripPlan.exclusions.map((exclusion, index) => (
                                    <div key={index} className="space-y-4 mb-4">
                                        <input
                                            type="text"
                                            name="title"
                                            value={exclusion.title}
                                            onChange={(e) => handleArrayChange(e, 'exclusions', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Title"
                                        />
                                        <textarea
                                            name="description"
                                            value={exclusion.description}
                                            onChange={(e) => handleArrayChange(e, 'exclusions', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Description"
                                            rows="2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('exclusions', index)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('exclusions', { title: '', description: '' })}
                                    className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    + Add Exclusion
                                </button>
                            </div>
                        </section>
                        
                        {/* important points */}
                        <section className='bg-gray-50 p-6 rounded-lg'>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Important Points</h2>
                                {tripPlan.importantPoints.map((point, index) => (
                                    <div key={index} className="space-y-4 mb-4">
                                        <input
                                            type="text"
                                            name="title"
                                            value={point.title}
                                            onChange={(e) => handleArrayChange(e, 'importantPoints', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Title"
                                        />
                                        <textarea
                                            name="description"
                                            value={point.description}
                                            onChange={(e) => handleArrayChange(e, 'importantPoints', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Description"
                                            rows="2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('importantPoints', index)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('importantPoints', { title: '', description: '' })}
                                    className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    + Add Important Point
                                </button>
                            </div>
                        </section>
                        
                        {/* Images Section */}
                        <section className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Images</h2>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImagesUpload(e)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
                        </section>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Submit Trip Plan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TripPlanForm;