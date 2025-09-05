"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Link as LinkIcon,
} from "lucide-react";

export default function AddArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleSubmit = async () => {
    if (!image || !title || !category || !content) {
      toast.error("All fields must be filled!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    formData.append("image", image);

    try {
      toast.success("Article created successfully!");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create article");
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Create Articles</h2>

        {/* Upload Thumbnail */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Thumbnails</label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              id="thumbnail"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="thumbnail" className="cursor-pointer text-gray-500">
              {image ? (
                <span className="text-sm">{image.name}</span>
              ) : (
                <>
                  <p className="text-sm">Click to select files</p>
                  <p className="text-xs text-gray-400">
                    Support File Type : .jpg or .png
                  </p>
                </>
              )}
            </label>
          </div>
          {!image && (
            <p className="text-sm text-red-500 mt-1">Please enter picture</p>
          )}
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Title</label>
          <Input
            placeholder="Input title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {!title && (
            <p className="text-sm text-red-500 mt-1">Please enter title</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Category</label>
          <Select value={category} onValueChange={(val) => setCategory(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Lifestyle">Lifestyle</SelectItem>
            </SelectContent>
          </Select>
          {!category && (
            <p className="text-sm text-red-500 mt-1">Please select category</p>
          )}
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Content</label>

          {editor && (
            <div className="flex flex-wrap gap-2 border rounded-md p-2 mb-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-gray-200" : ""}
              >
                <Bold size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-gray-200" : ""}
              >
                <Italic size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-gray-200" : ""}
              >
                <UnderlineIcon size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "bg-gray-200" : ""}
              >
                <Strikethrough size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
                }
              >
                <Heading2 size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
              >
                <List size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
              >
                <ListOrdered size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
              >
                <Quote size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive("codeBlock") ? "bg-gray-200" : ""}
              >
                <Code size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
                className={editor.isActive("link") ? "bg-gray-200" : ""}
              >
                <LinkIcon size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().undo().run()}
              >
                <Undo size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().redo().run()}
              >
                <Redo size={16} />
              </Button>
            </div>
          )}

          <div className="border rounded-md p-2 min-h-[200px]">
            <EditorContent editor={editor} />
          </div>

          {!content && (
            <p className="text-sm text-red-500 mt-1">
              Content field cannot be empty
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Cancel
          </Button>
          <Button variant="outline">Preview</Button>
          <Button className="bg-[#2563EB]" onClick={handleSubmit}>
            Upload
          </Button>
        </div>
      </Card>
    </div>
  );
}
