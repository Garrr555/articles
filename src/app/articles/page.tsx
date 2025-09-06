"use client";

import { useEffect, useState } from "react";
import { getArticles } from "@/lib/apiArticles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import Footer from "@/components/view/Footer";
import Navbar from "@/components/view/Navbar";
import Image from "next/image";
import { Search } from "lucide-react";
import { getCategories } from "@/lib/apiCategories";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
};

type Article = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: { id: string; name: string };
  user: { id: string; username: string; role: string };
  image: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await getArticles({
          title: search || undefined,
          category: category || undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
          page,
          limit: perPage,
        });
        setArticles(res.data || []);
        setTotal(res.total || 0);
      } catch (err) {
        console.error("Failed to fetch articles", err);
      }
    };
    fetchArticles();
  }, [search, category, page]);

  const totalPages = Math.ceil(total / perPage);

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

  return (
    <div className="">
      <div className="relative w-full h-[650px] sm:h-[500px] overflow-hidden">
        {/* Gambar */}
        <Image
          src="/hero.jpg"
          alt="example"
          width={600}
          height={50}
          className="w-full h-full object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#2563EB]/[0.86]" />

        {/* Teks di atas overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-between">
          <Navbar invert />
          <div className="text-white text-center max-w-[900px] px-5 pb-20 ">
            <p className="mb-5 font-semibold text-lg sm:text-xl">Blog genzet</p>
            <p className="font-bold text-3xl sm:text-4xl lg:text-5xl ">
              The Journal : Design Resources, Interviews, and Industry News
            </p>
            <p className="mt-5 mb-10 text-2xl">
              Your daily dose of design insights!
            </p>
            <div className="text-black flex flex-col sm:flex-row justify-center items-center gap-2 bg-[#3B82F6] p-4 rounded-xl w-2/3 mx-auto">
              {/* Select */}
              <Select
                value={category}
                onValueChange={(val) => setCategory(val)}
              >
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

              {/* Search */}
              <div className="flex px-2 bg-white items-center rounded-lg w-full sm:w-2/3">
                <Search className="text-gray-300" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search articles..."
                  className="w-full bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10 mb-32">
        {/* Info jumlah */}
        <p className="text-md font-semibold text-[#475569] mb-4">
          Showing : {articles.length} of {total} articles
        </p>

        {/* Daftar artikel */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="hover:shadow-md transition"
              onClick={() => router.push(`/articles/${article.id}`)}
            >
              <CardHeader>
                <CardTitle>
                  <Image
                    src={article.image || "/artikel.svg"}
                    alt={article.title}
                    width={600}
                    height={50}
                    className="w-full h-full object-cover"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-[#475569] font-semibold">
                  {new Date(article.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <p className="text-[#0F172A] font-semibold text-2xl my-3">
                  {article.title}
                </p>

                <p className="text-[#475569] font-semibold">
                  {article.content}
                </p>
                <div className="flex text-sm text-[#1E3A8A] my-2 ">
                  <p className="bg-[#BFDBFE] py-2 px-3 rounded-full">
                    {article.category?.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <Footer />
    </div>
  );
}
