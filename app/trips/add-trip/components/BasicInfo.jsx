'use client';

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
const BasicInfo = ({ tripPlan, setTripPlan }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripPlan({ ...tripPlan, [name]: value });
    };

    const descriptionEditor = useEditor({
        extensions: [StarterKit],
        content: tripPlan.description,

        immediatelyRender: false,

        onUpdate: ({ editor }) => {
            setTripPlan((prev) => ({
                ...prev,
                description: editor.getHTML(),
            }));
        },
    });
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
                <div className="md:col-span-2"> {/* Make description span full width */}
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        {/* Toolbar */}
                        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-100">
                            <button
                                type="button"
                                onClick={() => descriptionEditor?.chain().focus().toggleBold().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${descriptionEditor?.isActive('bold') ? 'bg-gray-300' : ''}`}
                            >
                                <strong>B</strong>
                            </button>
                            <button
                                type="button"
                                onClick={() => descriptionEditor?.chain().focus().toggleItalic().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${descriptionEditor?.isActive('italic') ? 'bg-gray-300' : ''}`}
                            >
                                Italics
                            </button>
                            <button
                                type="button"
                                onClick={() => descriptionEditor?.chain().focus().toggleBulletList().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${descriptionEditor?.isActive('bulletList') ? 'bg-gray-300' : ''}`}
                            >
                                • List
                            </button>
                            <button
                                type="button"
                                onClick={() => descriptionEditor?.chain().focus().toggleOrderedList().run()}
                                className={`p-2 rounded hover:bg-gray-200 ${descriptionEditor?.isActive('orderedList') ? 'bg-gray-300' : ''}`}
                            >
                                1. List
                            </button>
                        </div>

                        {/* Editor content */}
                        <EditorContent
                            editor={descriptionEditor}
                            className="min-h-[200px] p-4 focus:outline-none bg-white"
                        />
                    </div>
                </div>
                {['slug', 'title', 'city', 'route', 'ageGroup', 'minPrice'].map((field) => (
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