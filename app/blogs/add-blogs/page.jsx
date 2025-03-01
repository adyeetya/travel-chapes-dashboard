// pages/create-blog.js
'use client'; // Ensure this is at the top for Next.js client-side rendering
import React from 'react';
import TiptapEditor from './BlogEditor'; // Adjust the import path if necessary

const CreateBlog = () => {
  const handleSave = async (formData) => {
    try {
      // Log the formData to the console
      console.log('Form Data:', formData);

      // Log individual fields for clarity
      console.log('Title:', formData.get('title'));
      console.log('Content:', formData.get('content'));

      // Log images (if any)
      const images = formData.getAll('images');
      if (images.length > 0) {
        console.log('Images:', images);
      } else {
        console.log('No images uploaded.');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <TiptapEditor onSave={handleSave} />
    </div>
  );
};

export default CreateBlog;