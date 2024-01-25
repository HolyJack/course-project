"use client";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  HeadingIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  StrikethroughIcon,
  UndoIcon,
} from "lucide-react";
import { Toggle } from "./Toggle";
import { Button } from "./Button";
import { Separator } from "./Separator";
import { Editor } from "@tiptap/react";

type props = {
  editor: Editor | null;
};

export default function Toolbar({ editor }: props) {
  if (!editor) return null;

  return (
    <div className="flex items-center space-x-0.5 px-0.5 py-1">
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        type="button"
        className="hover:bg-shadow hover:text-primary px-3"
      >
        <UndoIcon size={16} />
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        type="button"
        className="hover:bg-shadow hover:text-primary px-3"
      >
        <RedoIcon size={16} />
      </Button>
      <Separator orientation="vertical" className="py-3 " />
      <Toggle
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <HeadingIcon size={16} />
      </Toggle>
      <Separator orientation="vertical" className="py-3 " />
      <Toggle
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon size={16} />
      </Toggle>
      <Separator orientation="vertical" className="py-3 " />
      <Toggle
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon size={16} />
      </Toggle>
      <Separator orientation="vertical" className="py-3" />

      <Toggle
        pressed={editor.isActive({ textAlign: "left" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
      >
        <AlignLeftIcon size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive({ textAlign: "center" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
      >
        <AlignCenterIcon size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive({ textAlign: "right" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
      >
        <AlignRightIcon size={16} />
      </Toggle>
    </div>
  );
}
