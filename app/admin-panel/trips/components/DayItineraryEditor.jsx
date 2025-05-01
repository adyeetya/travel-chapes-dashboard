"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const DayItineraryEditor = ({ day, content, onContentChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: typeof content === 'string' ? content : content?.description || "",
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(day - 1, editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor && content) {
      const description = typeof content === 'string' ? content : content?.description || "";
      editor.commands.setContent(description);
    }
  }, [content, editor]);

  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium text-lg mb-3">Day {day}</h4>
      <div className="border rounded p-2 min-h-40">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default DayItineraryEditor;