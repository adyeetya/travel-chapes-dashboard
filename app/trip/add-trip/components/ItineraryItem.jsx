"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const ItineraryItem = ({ item, index, updateDescription }) => {
  // Call useEditor at the top level of this component
  const editor = useEditor({
    extensions: [StarterKit],
    content: item.description,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      updateDescription(index, editor.getHTML());
    },
  });

  // Optional: if the parent item changes, update the editor's content
  useEffect(() => {
    if (editor && item.description !== editor.getHTML()) {
      editor.commands.setContent(item.description);
    }
  }, [item.description, editor]);

  return (
    <div>
      {/* Toolbar example */}
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
          Italics
        </button>
        <button
          type="button"
          onClick={() =>
            editor?.chain().focus().toggleBulletList().run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("bulletList") ? "bg-gray-300" : ""
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() =>
            editor?.chain().focus().toggleOrderedList().run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("orderedList") ? "bg-gray-300" : ""
          }`}
        >
          1. List
        </button>
      </div>
      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="min-h-[150px] p-4 bg-white border rounded-lg"
      />
    </div>
  );
};

export default ItineraryItem;
