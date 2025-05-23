'use client'
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

const TiptapEditor = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2], // Only allow h2 for subheadings
        },
      }),
      Image.configure({
        inline: false, // Images are block-level elements
        allowBase64: true, // Allow base64 images for local use
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
    ],
    content: '<p>Start writing your blog post...</p>',
  });

  // Add image to the editor with height and width
  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target.result;

          // Prompt for height and width
          const width = prompt('Enter image width (e.g., 500):');
          const height = prompt('Enter image height (e.g., 300):');

          if (width && height) {
            editor
              .chain()
              .focus()
              .setImage({
                src: base64Image,
                alt: 'Blog image',
                width: `${width}px`,
                height: `${height}px`,
              })
              .run();
          } else {
            alert('Width and height are required.');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
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

    setIsSaving(true);
    try {
      const content = editor.getHTML();

      // Extract base64 images from content
      const base64Images = Array.from(content.matchAll(/<img[^>]+src="([^">]+)"/g)).map(
        (match) => match[1]
      );

      // Send data to the backend
      const formData = {
        title,
        content,
        images: base64Images,
      };

      console.log('Form Data:', formData);
      console.log('Content:', formData.content);

      // Call the onSave function (replace with your API call)
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Title Input */}
      <input
        type="text"
        placeholder="Blog post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-4xl font-bold mb-8 p-2 border-b-2 focus:outline-none border-transparent focus:border-gray-300"
      />

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
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
        >
          Insert Image
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