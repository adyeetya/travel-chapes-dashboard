"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

const DayItineraryEditor = ({ day, content, onContentChange }) => {
  const [initialContent, setInitialContent] = useState(content);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent?.description || "",
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(day - 1, {
          day: `Day ${day}`,
          title: initialContent?.title || "",
          description: editor.getHTML()
        });
      }
    },
  });

  useEffect(() => {
    if (editor && content) {
      setInitialContent(content);
      editor.commands.setContent(content.description || "");
    }
  }, [content, editor]);

  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium text-lg mb-3">Day {day}</h4>
      {initialContent?.title && (
        <div className="mb-2">
          <input
            type="text"
            value={initialContent.title}
            onChange={(e) => {
              const newContent = { ...initialContent, title: e.target.value };
              setInitialContent(newContent);
              onContentChange(day - 1, newContent);
            }}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter title"
          />
        </div>
      )}
      <div className="border rounded p-2 min-h-40">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default DayItineraryEditor;