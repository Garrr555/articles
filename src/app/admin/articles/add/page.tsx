/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
  ArrowLeft,
  Loader2Icon,
} from "lucide-react";
import { createArticle } from "@/lib/apiArticles";
import { getCategories } from "@/lib/apiCategories";
import Navbar from "@/components/view/Navbar";
import Link from "next/link";
import TiptapLink from "@tiptap/extension-link";

type Category = {
  id: string;
  name: string;
};

export default function AddArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline, TiptapLink],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        console.log("🔍 Fetching categories...");
        const data = await getCategories();
        console.log("🔍 Categories received:", data);

        // ✅ PERBAIKAN: Double check filter di frontend juga
        const validCategories = data.filter(
          (cat: Category) => cat.id && cat.id.trim() !== ""
        );
        console.log("🔍 Valid categories after filter:", validCategories);

        setCategories(validCategories);

        if (validCategories.length === 0) {
          toast.error("Tidak ada kategori yang tersedia");
        }
      } catch (error) {
        console.error("❌ Gagal fetch categories:", error);
        toast.error("Gagal memuat kategori");
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    console.log("🔍 Submit button clicked");

    // ✅ PERBAIKAN: Enhanced validation
    if (!title.trim()) {
      toast.error("Judul tidak boleh kosong");
      return;
    }

    if (!content.trim() || content === "<p></p>") {
      toast.error("Konten tidak boleh kosong");
      return;
    }

    if (!category || category.trim() === "") {
      toast.error("Kategori harus dipilih");
      return;
    }

    // ✅ PERBAIKAN: Validate category exists in list
    const selectedCategory = categories.find((cat) => cat.id === category);
    if (!selectedCategory) {
      toast.error("Kategori yang dipilih tidak valid");
      return;
    }

    try {
      setLoading(true);

      const articleData = {
        title: title.trim(),
        content: content,
        categoryId: category,
      };

      console.log("🔍 Final article data:", articleData);
      console.log("🔍 Selected category:", selectedCategory);

      const result = await createArticle(articleData);
      console.log("✅ Article created successfully:", result);

      toast.success("Artikel berhasil ditambahkan!");
      router.push("/admin");
    } catch (error: any) {
      console.error("❌ Submit failed:", error);
      toast.error(error.message || "Gagal upload artikel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white/50">
        <Navbar useName name={"Articles"} />
      </div>
      <div className="p-6">
        <Card className="p-6 bg-gray-50">
          <Link href="/admin">
            <div className="flex items-center gap-2">
              <ArrowLeft />
              <p className="text-lg font-semibold">Create Articles</p>
            </div>
          </Link>

          {/* Upload Thumbnail - Optional */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Thumbnails</label>
            <div className="bg-white max-w-72 min-h-60 border-2 border-dashed rounded-lg p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-gray-100">
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
              <label
                htmlFor="thumbnail"
                className="cursor-pointer text-gray-500"
              >
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
          </div>

          {/* Title */}
          <div className="mb-6 ">
            <label className="block font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Input title"
              className="bg-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {!title.trim() && (
              <p className="text-sm text-red-500 mt-1">Please enter title</p>
            )}
          </div>

          {/* Category */}
          <div className="mb-6 w-full">
            <label className="block font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <Select value={category} onValueChange={(val) => setCategory(val)}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!category && (
              <p className="text-sm text-red-500 mt-1">
                Please select category
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {categories.length} categories available
            </p>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Content <span className="text-red-500">*</span>
            </label>

            {editor && (
              <div className="bg-white flex flex-wrap gap-2 border-x border-t rounded-t-md p-2 ">
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
                    editor.isActive("heading", { level: 2 })
                      ? "bg-gray-200"
                      : ""
                  }
                >
                  <Heading2 size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
                >
                  <List size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={
                    editor.isActive("orderedList") ? "bg-gray-200" : ""
                  }
                >
                  <ListOrdered size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
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

            <div className="border rounded-b-md p-2 min-h-[400px]">
              <EditorContent
                editor={editor}
                className="outline-none focus:outline-none w-full h-full whitespace-normal break-words"
              />
            </div>

            {(!content.trim() || content === "<p></p>") && (
              <p className="text-sm text-red-500 mt-1">
                Content field cannot be empty
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/articles")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="outline" disabled={loading}>
              Preview
            </Button>
            <Button
              className="bg-[#2563EB]"
              onClick={handleSubmit}
              disabled={loading || categories.length === 0}
            >
              {loading ? <Loader2Icon className="animate-spin"/> : "Upload"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
