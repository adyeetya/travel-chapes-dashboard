// pages/create-blog.js
'use client'; // Ensure this is at the top for Next.js client-side rendering
import React, { useState } from 'react';
import TiptapEditor from './BlogEditor'; // Adjust the import path if necessary
import axios from 'axios';
import { ServerUrl } from '@/app/config';
import auth from "@/utils/auth";
const CreateBlog = () => {
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'
  const token = auth.getToken();
  const handleSave = async (formData) => {
    setMessage(null);
    setMessageType('');
    try {
      // Call backend API to create blog
      const res = await axios.post(
        `${ServerUrl}/blog/createBlog`,
        formData,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, } }
      );
      setMessage('Blog created successfully!');
      setMessageType('success');
    } catch (error) {
      let msg = 'Failed to create blog.';
      if (error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
      setMessage(msg);
      setMessageType('error');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      {message && (
        <div className={`mb-4 p-3 rounded ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>
      )}
      <TiptapEditor onSave={handleSave} />
    </div>
  );
};

export default CreateBlog;