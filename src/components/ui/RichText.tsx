"use client";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichText({ content }: { content: string }) {
  const editor = useEditor({
    editable: false,
    content,
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert min-h-[60px] min-w-full",
      },
    },
  });
  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
