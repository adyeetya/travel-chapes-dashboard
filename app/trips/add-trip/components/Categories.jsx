import { useState, useEffect } from 'react';
import axios from 'axios';
import { ServerUrl } from '@/app/config';
import auth from '@/utils/auth';

const Categories = ({ tripPlan, setTripPlan }) => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState('');
    const token = auth.getToken();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${ServerUrl}/tripcategory/getCategoryList`);
            setCategories(response.data.result);
        } catch (err) {
            setError('Failed to fetch categories');
            console.error(err);
        }
    };

    const handleCategoryChange = (selected) => {
        const updatedCategories = tripPlan.category.includes(selected)
            ? tripPlan.category.filter(cat => cat !== selected)
            : [...tripPlan.category, selected];
        setTripPlan({ ...tripPlan, category: updatedCategories });
    };

    const handleCreateCategory = async () => {
        try {
            if (!newCategory.trim()) return;
            
            await axios.post(`${ServerUrl}/tripcategory/createTripCategory`, 
                { category: newCategory },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setNewCategory('');
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            setError('Failed to create category');
            console.error(err);
        }
    };

    return (
        <section className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Add New Category
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div key={category._id} className="flex items-center">
                        <input
                            type="checkbox"
                            id={category._id}
                            checked={tripPlan.category.includes(category.category)}
                            onChange={() => handleCategoryChange(category.category)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor={category._id} className="ml-2 text-gray-700">
                            {category.category}
                        </label>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                        <div>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Category name"
                                required
                            />
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Categories;