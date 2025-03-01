'use client'
import { useState } from 'react';

const TripPlanForm = () => {
    const [tripPlan, setTripPlan] = useState({
        id: '',
        name: '',
        title: '',
        route: '',
        duration: '',
        category: [],
        ageGroup: '',
        minPrice: '',
        batch: [],
        banners: { phone: '', web: '' },
        images: [],
        metaTitle: '',
        metaDescription: '',
        headline: '',
        description: '',
        shortItinerary: [],
        fullItinerary: [],
        inclusions: [],
        exclusions: [],
        importantPoints: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripPlan({ ...tripPlan, [name]: value });
    };

    const handleArrayChange = (e, arrayName, index, nestedArrayName, nestedIndex) => {
        const { name, value } = e.target;

        if (nestedArrayName) {
            // Handle nested arrays (e.g., batch.transports)
            const updatedArray = [...tripPlan[arrayName]];
            updatedArray[index][nestedArrayName][nestedIndex][name] = value;
            setTripPlan({ ...tripPlan, [arrayName]: updatedArray });
        } else if (typeof tripPlan[arrayName][index] === 'string') {
            // Handle simple arrays (e.g., category)
            const updatedArray = [...tripPlan[arrayName]];
            updatedArray[index] = value;
            setTripPlan({ ...tripPlan, [arrayName]: updatedArray });
        } else {
            // Handle arrays of objects (e.g., shortItinerary, fullItinerary)
            const updatedArray = [...tripPlan[arrayName]];
            updatedArray[index][name] = value;
            setTripPlan({ ...tripPlan, [arrayName]: updatedArray });
        }
    };

    const addArrayItem = (arrayName, defaultItem) => {
        setTripPlan({ ...tripPlan, [arrayName]: [...tripPlan[arrayName], defaultItem] });
    };

    // Add a new transport to a batch
    const addTransport = (batchIndex) => {
        const updatedBatch = [...tripPlan.batch];
        updatedBatch[batchIndex].transports.push({
            type: '',
            costTripleSharing: '',
            costDoubleSharing: '',
        });
        setTripPlan({ ...tripPlan, batch: updatedBatch });
    };

    // Remove an item from an array
    const removeArrayItem = (arrayName, index, nestedArrayName, nestedIndex) => {
        if (nestedArrayName) {
            // Handle nested arrays (e.g., batch.transports)
            const updatedArray = [...tripPlan[arrayName]];
            updatedArray[index][nestedArrayName] = updatedArray[index][nestedArrayName].filter(
                (_, i) => i !== nestedIndex
            );
            setTripPlan({ ...tripPlan, [arrayName]: updatedArray });
        } else {
            // Handle top-level arrays
            const updatedArray = tripPlan[arrayName].filter((_, i) => i !== index);
            setTripPlan({ ...tripPlan, [arrayName]: updatedArray });
        }
    };

    const handleBannerUpload = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
    
        setTripPlan((prev) => ({
            ...prev,
            banners: {
                ...prev.banners,
                [field]: file, // Store the File object
            },
        }));
    };
    
    const handleImagesUpload = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
    
        setTripPlan((prev) => ({
            ...prev,
            images: [...prev.images, ...Array.from(files)], // Store File objects
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate the submitted data against the schema
        const isValid = validateTripPlanData(tripPlan);
        // if (!isValid) {
        //     console.error('Validation failed: Submitted data does not match the schema.');
        //     return;
        // }
    
        // Create a FormData object
        const formData = new FormData();
    
        // Append all non-file fields to FormData
        for (const key in tripPlan) {
            if (key === 'banners' || key === 'images') continue; // Skip banners and images for now
            if (Array.isArray(tripPlan[key])) {
                formData.append(key, JSON.stringify(tripPlan[key])); // Serialize arrays
            } else {
                formData.append(key, tripPlan[key]);
            }
        }
    
        // Append banner images
        if (tripPlan.banners.phone instanceof File) {
            formData.append('phoneBanner', tripPlan.banners.phone);
        }
        if (tripPlan.banners.web instanceof File) {
            formData.append('webBanner', tripPlan.banners.web);
        }
    
        // Append images array
        tripPlan.images.forEach((image, index) => {
            if (image instanceof File) {
                formData.append(`images`, image);
            }
        });
    
        // Log FormData contents
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
    
        try {
            // const response = await fetch('/api/tripPlan', {
            //     method: 'POST',
            //     body: formData, // No need to set Content-Type header, FormData handles it
            // });
    
            // if (!response.ok) {
            //     throw new Error('Failed to submit trip plan');
            // }
    
            // const data = await response.json();
            // console.log('API Response:', data);
        } catch (error) {
            console.error('Error submitting trip plan:', error);
        }
    };

    // Validation function to check if the data matches the schema
    const validateTripPlanData = (data) => {
        // Required fields
        const requiredFields = ['id', 'name'];
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                console.error(`Validation failed: Missing or empty required field "${field}".`);
                return false;
            }
        }

        // Validate arrays (ensure they are not empty if required)
        const arrayFields = ['category', 'batch', 'images', 'shortItinerary', 'fullItinerary', 'inclusions', 'exclusions', 'importantPoints'];
        for (const field of arrayFields) {
            if (!Array.isArray(data[field])) {
                console.error(`Validation failed: "${field}" must be an array.`);
                return false;
            }
            if (data[field].length === 0) {
                console.error(`Validation failed: "${field}" array cannot be empty.`);
                return false;
            }
        }

        // Validate nested objects in batch
        if (data.batch) {
            for (const batch of data.batch) {
                if (!batch.date || batch.date.trim() === '') {
                    console.error('Validation failed: Each batch must have a non-empty "date".');
                    return false;
                }
                if (!Array.isArray(batch.transports) || batch.transports.length === 0) {
                    console.error('Validation failed: Each batch must have a non-empty "transports" array.');
                    return false;
                }

                for (const transport of batch.transports) {
                    if (
                        !transport.type ||
                        !transport.costTripleSharing ||
                        !transport.costDoubleSharing ||
                        transport.type.trim() === '' ||
                        transport.costTripleSharing.trim() === '' ||
                        transport.costDoubleSharing.trim() === ''
                    ) {
                        console.error(
                            'Validation failed: Each transport must have non-empty "type", "costTripleSharing", and "costDoubleSharing".'
                        );
                        return false;
                    }
                }
            }
        }

        // Validate banners
        if (
            !data.banners ||
            typeof data.banners.phone !== 'string' ||
            typeof data.banners.web !== 'string' ||
            data.banners.phone.trim() === '' ||
            data.banners.web.trim() === ''
        ) {
            console.error('Validation failed: "banners" must have non-empty "phone" and "web" strings.');
            return false;
        }

        // Validate other string fields (ensure they are not empty if required)
        const stringFields = ['title', 'route', 'duration', 'ageGroup', 'minPrice', 'metaTitle', 'metaDescription', 'headline', 'description'];
        for (const field of stringFields) {
            if (data[field] && typeof data[field] === 'string' && data[field].trim() === '') {
                console.error(`Validation failed: "${field}" cannot be an empty string.`);
                return false;
            }
        }

        // Validate status
        if (data.status && !['active', 'delete'].includes(data.status)) {
            console.error('Validation failed: "status" must be either "active" or "delete".');
            return false;
        }

        // If all checks pass, the data is valid
        return true;
    };


    return (


        // ----------------------------
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
                                {['id', 'name', 'title', 'route', 'duration', 'ageGroup', 'minPrice'].map((field) => (
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
                                            onChange={(e) => handleArrayChange(e, 'category', index)}
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
                        {/* short iteneries */}
                        <section className="bg-gray-50 p-6 rounded-lg">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Short Itinerary</h2>
                                {tripPlan.shortItinerary.map((itinerary, index) => (
                                    <div key={index} className="space-y-4 mb-4">
                                        <input
                                            type="text"
                                            name="day"
                                            value={itinerary.day}
                                            onChange={(e) => handleArrayChange(e, 'shortItinerary', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Day"
                                        />
                                        <textarea
                                            name="description"
                                            value={itinerary.description}
                                            onChange={(e) => handleArrayChange(e, 'shortItinerary', index)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Description"
                                            rows="2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('shortItinerary', index)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('shortItinerary', { day: '', description: '' })}
                                    className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    + Add Short Itinerary
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

                        {/* Batches Section */}
                        <section className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Batches</h2>
                            <div className="space-y-6">
                                {tripPlan.batch.map((batch, batchIndex) => (
                                    <div key={batchIndex} className="border p-6 rounded-lg bg-white">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                                <input
                                                    type="text"
                                                    name="date" // Add name attribute
                                                    value={batch.date}
                                                    onChange={(e) => handleArrayChange(e, 'batch', batchIndex)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-medium text-gray-700">Transports</h3>
                                                {batch.transports.map((transport, transportIndex) => (
                                                    <div key={transportIndex} className="space-y-4 border p-4 rounded-md bg-gray-50">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            {['type', 'costTripleSharing', 'costDoubleSharing'].map((field) => (
                                                                <div key={field}>
                                                                    <label className="block text-sm text-gray-700 capitalize mb-2">
                                                                        {field.replace(/([A-Z])/g, ' $1').trim()}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name={field} // Add name attribute
                                                                        value={transport[field]}
                                                                        onChange={(e) =>
                                                                            handleArrayChange(e, 'batch', batchIndex, 'transports', transportIndex)
                                                                        }
                                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeArrayItem('batch', batchIndex, 'transports', transportIndex)}
                                                            className="text-sm text-red-600 hover:text-red-800"
                                                        >
                                                            Remove Transport
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => addTransport(batchIndex)}
                                                    className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                                >
                                                    + Add Transport
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('batch', batchIndex)}
                                            className="mt-4 text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove Batch
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('batch', { date: '', transports: [] })}
                                    className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    + Add Batch
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