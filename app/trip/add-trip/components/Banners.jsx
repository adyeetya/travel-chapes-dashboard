const Banners = ({ tripPlan, setTripPlan }) => {
    const handleBannerUpload = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
    
        setTripPlan({
            ...tripPlan,
            banners: {
                ...tripPlan.banners,
                [field]: file,
            },
        });
    };

    return (
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
    );
};

export default Banners;