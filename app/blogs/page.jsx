'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ServerUrl } from '@/app/config';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${ServerUrl}/blog/blogList`);
        // console.log('Blogs:', res.data);
        setBlogs(res.data.result || []);
      } catch (err) {
        setError('Failed to fetch blogs.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/blogs/add-blogs">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Blog</button>
        </Link>
      </div>
      {loading && <div>Loading blogs...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!loading && !error && blogs.length === 0 && <div>No blogs found.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white shadow rounded p-4 flex flex-col gap-2">
            {blog.image && (
              <img src={blog.image} alt={blog.title} className="h-40 w-full object-cover rounded mb-2" />
            )}
            <h2 className="text-lg font-semibold">{blog.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.text }} />
            <div className="text-xs text-gray-500 mt-auto">By {blog.author || 'Unknown'}{blog.location && ` | ${blog.location}`}</div>
            <Link href={`/blogs/edit-blogs/${blog._id}`}>
              <button className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;