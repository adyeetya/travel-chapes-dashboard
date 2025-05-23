'use client'
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDropzone } from 'react-dropzone';
import { ServerUrl } from '@/app/config';
import { FiUpload, FiX, FiImage, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import auth from '@/utils/auth';

const EditBlogPage = ({ params }) => {
  const blogId = use(params).blogId;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ text: '', image: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState(null); // File or URL
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'ready' | 'uploading' | 'success' | 'error' | 'invalid'

  // Tiptap rich text editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: form.text || '<p>Start editing your blog post...</p>',
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, text: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (!blogId) return;
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${ServerUrl}/blog/viewBlog`, {
          params: { _id: blogId },
        });
        const data = res.data?.result || res.data?.data || res.data;
        if (data && (data.text !== undefined || data.image !== undefined)) {
          setForm({
            text: data.text || '',
            image: data.image || '',
          });
          if (editor) editor.commands.setContent(data.text || '');
        } else {
          setError(res.data?.message || 'Failed to fetch blog');
        }
      } catch (err) {
        setError('Error fetching blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId, editor]);

  // Dropzone for main image
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      setUploadStatus('invalid');
      return;
    }
    setImageFile(file);
    setUploadStatus('ready');
  };

  const dropzone = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
    maxFiles: 1,
  });

  const uploadImage = async () => {
    if (!imageFile || typeof imageFile === 'string') return;
    setUploading(true);
    setUploadStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('keyId', blogId || 'blog');
      const response = await axios.post(`${ServerUrl}/admin/uploadFileOnS3`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = response.data.result.url;
      setForm((prev) => ({ ...prev, image: imageUrl }));
      setImageFile(imageUrl);
      setUploadStatus('success');
    } catch (e) {
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setUploadStatus(null);
    setForm((prev) => ({ ...prev, image: '' }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'image') {
      setImageFile(e.target.value);
      setUploadStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = auth.getToken();
    try {
      const res = await axios.put(
        `${ServerUrl}/blog/updateBlog`,
        {
          _id: blogId,
          ...form,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('Update response:', res);
      if (res.status === 200) {
        setSuccess('Blog updated successfully!');
      } else {
        setError(res.data?.message || 'Update failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Error updating blog'
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={() => window.location.href = '/blogs'}
          className="mr-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Edit Blog</h1>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800 flex items-center gap-2">
          <FiAlertCircle className="text-xl" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 flex items-center gap-2">
          <FiCheckCircle className="text-xl" />
          <span>{success}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Section */}
        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-2"
            placeholder="Paste image URL or upload below"
          />
          <div {...dropzone.getRootProps()} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${dropzone.isDragActive ? 'border-blue-400 bg-blue-50' : imageFile instanceof File ? 'border-blue-300 bg-blue-50' : typeof imageFile === 'string' && imageFile !== '' ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
            <input {...dropzone.getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              {imageFile instanceof File ? (
                <>
                  <FiImage className="w-10 h-10 text-blue-500" />
                  <p className="text-sm font-medium text-gray-700">{imageFile.name}</p>
                  <p className="text-xs text-gray-500">{(imageFile.size / 1024).toFixed(1)} KB • {imageFile.type.split('/')[1].toUpperCase()}</p>
                </>
              ) : typeof imageFile === 'string' && imageFile !== '' ? (
                <>
                  <div className="relative">
                    <img src={imageFile} alt="Uploaded banner" className="h-20 object-contain rounded border border-gray-200" />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                      <FiCheckCircle size={14} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 truncate max-w-full">{imageFile.split('/').pop()}</p>
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
            {imageFile instanceof File && (
              <button type="button" onClick={removeImage} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex-1"><FiX /> Remove</button>
            )}
            {imageFile instanceof File && (
              <button type="button" onClick={uploadImage} disabled={uploading} className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors flex-1 ${uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>{statusIcons[uploadStatus] || <FiUpload />}{uploading ? 'Uploading...' : 'Upload'}</button>
            )}
          </div>
          {uploadStatus === 'invalid' && (
            <p className="text-red-500 text-sm flex items-center gap-1"><FiAlertCircle /> Please select a valid image file</p>
          )}
          {uploadStatus === 'error' && (
            <p className="text-red-500 text-sm flex items-center gap-1"><FiAlertCircle /> Upload failed. Please try again.</p>
          )}
        </div>
        {/* Rich Text Editor Section */}
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <EditorContent editor={editor} className="min-h-[200px] border rounded p-2" />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading || uploading}
        >
          {loading || uploading ? 'Updating...' : 'Update Blog'}
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;