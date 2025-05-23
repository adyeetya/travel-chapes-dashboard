'use client'
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { ServerUrl } from '@/app/config';
import { FiUpload, FiX, FiImage, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const TiptapEditor = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [image, setImage] = useState(null); // File or URL
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'ready' | 'uploading' | 'success' | 'error' | 'invalid'
  const [location, setLocation] = useState('');
  const [destinationLink, setDestinationLink] = useState('');
  const [author, setAuthor] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
      }),
    ],
    content: '<p>Start writing your blog post...</p>',
  });

  // Dropzone for main image
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      setUploadStatus('invalid');
      return;
    }
    setImage(file);
    setUploadStatus('ready');
  };

  const dropzone = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
    maxFiles: 1,
  });

  const uploadImage = async () => {
    if (!image || typeof image === 'string') return;
    setUploading(true);
    setUploadStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('keyId', title || 'blog');
      const response = await axios.post(`${ServerUrl}/admin/uploadFileOnS3`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = response.data.result.url;
      setImage(imageUrl);
      setUploadStatus('success');
    } catch (e) {
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setUploadStatus(null);
  };

  // Save handler
  const handleSave = async () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    if (editor.isEmpty) {
      alert('Content is required');
      return;
    }
    if (!image || typeof image !== 'string') {
      alert('Please upload and save a main image for the blog.');
      return;
    }
    setIsSaving(true);
    try {
      const text = editor.getHTML();
      const payload = {
        title,
        text,
        image,
        location,
        destinationLink,
        author,
      };
      await onSave(payload);
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) return null;

  // Image upload UI (like Banners.jsx, but only one image)
  const statusIcons = {
    ready: <FiUpload className="text-blue-500" />,
    uploading: <FiLoader className="animate-spin text-yellow-500" />,
    success: <FiCheckCircle className="text-green-500" />,
    error: <FiAlertCircle className="text-red-500" />,
    invalid: <FiAlertCircle className="text-red-500" />,
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Title Input */}
      <input
        type="text"
        placeholder="Blog post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-4xl font-bold mb-4 p-2 border-b-2 focus:outline-none border-transparent focus:border-gray-300"
      />
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none"
        />
        <input
          type="text"
          placeholder="Destination Link"
          value={destinationLink}
          onChange={(e) => setDestinationLink(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none"
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none"
        />
      </div>

      {/* Main Image Upload */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FiImage className="text-blue-500" /> Blog Main Image (JPG, PNG, WEBP, Max 5MB)
        </label>
        <div {...dropzone.getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${dropzone.isDragActive ? 'border-blue-400 bg-blue-50' : image instanceof File ? 'border-blue-300 bg-blue-50' : typeof image === 'string' && image !== '' ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
          <input {...dropzone.getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            {image instanceof File ? (
              <>
                <FiImage className="w-10 h-10 text-blue-500" />
                <p className="text-sm font-medium text-gray-700">{image.name}</p>
                <p className="text-xs text-gray-500">{(image.size / 1024).toFixed(1)} KB • {image.type.split('/')[1].toUpperCase()}</p>
              </>
            ) : typeof image === 'string' && image !== '' ? (
              <>
                <div className="relative">
                  <img src={image} alt="Uploaded banner" className="h-20 object-contain rounded border border-gray-200" />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <FiCheckCircle size={14} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 truncate max-w-full">{image.split('/').pop()}</p>
              </>
            ) : (
              <>
                <FiUpload className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-600">Drag & drop image or click to browse</p>
                <p className="text-xs text-gray-400">Supports: JPG, PNG, WEBP (Max 5MB)</p>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {image instanceof File && (
            <button onClick={removeImage} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex-1"><FiX /> Remove</button>
          )}
          {image instanceof File && (
            <button onClick={uploadImage} disabled={uploading} className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors flex-1 ${uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>{statusIcons[uploadStatus] || <FiUpload />}{uploading ? 'Uploading...' : 'Upload'}</button>
          )}
        </div>
        {uploadStatus === 'invalid' && (
          <p className="text-red-500 text-sm flex items-center gap-1"><FiAlertCircle /> Please select a valid image file</p>
        )}
        {uploadStatus === 'error' && (
          <p className="text-red-500 text-sm flex items-center gap-1"><FiAlertCircle /> Upload failed. Please try again.</p>
        )}
      </div>

      {/* Editor Toolbar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        >
          Subheading (H2)
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`}
        >
          Paragraph
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className=" max-w-none min-h-[500px] border-none focus:outline-none"
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Publish Post'}
      </button>
    </div>
  );
};

export default TiptapEditor;