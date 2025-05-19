"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content if it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div>
      <div className="flex gap-1 p-2 border-b border-gray-300 bg-gray-100">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("bold") ? "bg-gray-300" : ""
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("italic") ? "bg-gray-300" : ""
          }`}
        >
          <em>I</em>  
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("bulletList") ? "bg-gray-300" : ""
          }`}
        >
          • List
        </button>
      </div>
      <EditorContent 
        editor={editor}
        className="prose max-w-none p-4 min-h-[100px] border-t border-gray-200 focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;
