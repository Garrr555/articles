/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
} from "lucide-react";
import { getArticleById, updateArticle } from "@/lib/apiArticles";
import { getCategories } from "@/lib/apiCategories";
import Navbar from "@/components/view/Navbar";
import Link from "next/link";
import TiptapLink from "@tiptap/extension-link";

type Category = {
  id: string;
  name: string;
};

type Article = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  category: { id: string; name: string };
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline, TiptapLink],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        console.log("🔍 Fetching categories...");
        const data = await getCategories();
        console.log("🔍 Categories received:", data);

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

  // Fetch article data untuk edit
  useEffect(() => {
    async function fetchArticle() {
      if (!articleId) {
        toast.error("ID artikel tidak ditemukan");
        router.push("/admin");
        return;
      }

      try {
        setInitialLoading(true);
        console.log("🔍 Fetching article with ID:", articleId);

        const data = await getArticleById(articleId);
        console.log("🔍 Article data received:", data);

        setArticle(data);
        setTitle(data.title);
        setCategory(data.categoryId || data.category?.id || "");
        setContent(data.content);

        // Set content ke editor setelah editor ready
        if (editor && data.content) {
          editor.commands.setContent(data.content);
        }
      } catch (error: any) {
        console.error("❌ Gagal fetch article:", error);
        toast.error("Gagal memuat data artikel");
        router.push("/admin");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchArticle();
  }, [articleId, router, editor]);

  // Set content ke editor ketika editor sudah ready
  useEffect(() => {
    if (editor && article?.content && !editor.getHTML()) {
      editor.commands.setContent(article.content);
      setContent(article.content);
    }
  }, [editor, article]);

  const handleSubmit = async () => {
    console.log("🔍 Submit button clicked");

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

      const result = await updateArticle(articleId, articleData);
      console.log("✅ Article updated successfully:", result);

      toast.success("Artikel berhasil diperbarui!");
      router.push("/admin");
    } catch (error: any) {
      console.error("❌ Submit failed:", error);
      toast.error(error.message || "Gagal memperbarui artikel");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div>
        <div className="bg-white/50">
          <Navbar useName name={"Articles"} />
        </div>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
            <p>Loading article data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div>
        <div className="bg-white/50">
          <Navbar useName name={"Articles"} />
        </div>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-gray-500">Artikel tidak ditemukan</p>
            <Button className="mt-4" onClick={() => router.push("/admin")}>
              Kembali ke Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white/50">
        <Navbar useName name={"Articles"} />
      </div>
      <div className="p-6">
        <Card className="p-6 bg-gray-50">
          <Link href="/admin">
            <div className="flex items-center gap-2 mb-6">
              <ArrowLeft />
              <p className="text-lg font-semibold">Edit Article</p>
            </div>
          </Link>

          {/* Article Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">
              Article Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">ID:</span>
                <span className="ml-2 font-mono">{article.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2">
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Updated:</span>
                <span className="ml-2">
                  {new Date(article.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Current Category:</span>
                <span className="ml-2 font-semibold">
                  {article.category?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Upload Thumbnail - Optional */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Thumbnails
              <span className="text-sm text-gray-500 ml-2">
                (Optional - currently not implemented)
              </span>
            </label>
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
          <div className="mb-6">
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
              <div className="bg-white flex flex-wrap gap-2 border-x border-t rounded-t-md p-2">
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

            <div className="border rounded-b-md p-2 min-h-[400px] bg-white">
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
              onClick={() => router.push("/admin")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => router.push(`/articles/${articleId}`)}
            >
              Preview
            </Button>
            <Button
              className="bg-[#2563EB]"
              onClick={handleSubmit}
              disabled={loading || categories.length === 0}
            >
              {loading ? "Updating..." : "Update Article"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
