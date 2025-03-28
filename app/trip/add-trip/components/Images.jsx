const Images = ({ tripPlan, setTripPlan }) => {
    const handleImagesUpload = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
    
        setTripPlan({
            ...tripPlan,
            images: [...tripPlan.images, ...Array.from(files)]
        });
    };

    return (
        <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Images</h2>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
        </section>
    );
};

export default Images;