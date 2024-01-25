"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { cn } from "@/shared/utils";
import Toolbar from "./EditorToolbar";

export default function Tiptap({
  description,
  onChange,
  className,
}: {
  description: string;
  onChange?: (text: string) => void;
  className?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert border-shadow min-h-[60px] min-w-full rounded-b-md border-t px-1.5 py-3 focus-visible:outline-none focus-visible:ring-1",
      },
    },
    onUpdate({ editor }) {
      if (onChange) onChange(editor.getHTML());
    },
  });
  if (!onChange) return null;

  return (
    <div
      className={cn(
        "placeholder:text-shadow border-shadow flex w-full flex-col rounded-md border bg-transparent text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
