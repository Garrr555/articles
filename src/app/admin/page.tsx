/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/apiAuth";
import { clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/view/Navbar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getArticles } from "@/lib/apiArticles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type Profile = {
  id: string;
  username: string;
  role: "User" | "Admin";
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

export default function AdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // jumlah artikel per halaman
  const [total, setTotal] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        if (data.role !== "Admin") {
          toast.error("You are not authorized to access admin page");
          router.push("/");
          return;
        }

        setProfile(data);
      } catch (err: any) {
        console.error("Admin page error:", err.response?.data || err.message);
        toast.error("Please login first");
        clearAuth();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

useEffect(() => {
  const fetchArticles = async () => {
    try {
      const res = await getArticles({
        page,
        limit,
        search: search || undefined,
        category: category !== "all" ? category : undefined,
      });
      setArticles(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to fetch articles", err);
    }
  };
  fetchArticles();
}, [page, limit, search, category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) return null;

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Navbar */}
      <div className="bg-white">
        <Navbar useName name={"Articles"} />
      </div>

      {/* Daftar Artikel */}
      <div className="p-6">
        <Card className=" border">
          <div className="flex flex-col justify-center gap-5 items-center mb-4">
            <div className="border-b w-full px-5 pb-5">
              <p className="text-lg font-semibold">Total Articles : {total}</p>
            </div>
            <div className="flex justify-between items-center w-full px-6">
              <div className="flex gap-2 items-center">
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    setPage(1); // reset ke halaman 1 tiap ganti kategori
                  }}
                >
                  <SelectTrigger className=" bg-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex px-2 items-center rounded-lg border">
                  <Search className="text-gray-300" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1); // reset ke halaman 1 tiap ganti search
                    }}
                    className="w-full bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <Button
                className="bg-[#2563EB]"
                onClick={() => router.push("/admin/articles/add")}
              >
                + Add Articles
              </Button>
            </div>
          </div>

          <Table className="">
            <TableHeader>
              <TableRow className="bg-gray-100 text-[#0F172A]">
                <TableHead className="text-center">Thumbnails</TableHead>
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Created At</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id} className="text-slate-600">
                  <TableCell className="flex justify-center">
                    <Image
                      src={article.image || "/artikel.svg"}
                      alt={article.title}
                      width={100}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="space-y-2  font-medium max-w-54 overflow-auto">
                    {article.title}
                  </TableCell>
                  <TableCell className="text-center">
                    {article.category?.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="link"
                      className="text-[#2563EB] underline"
                      onClick={() => router.push(`/articles/${article.id}`)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="link"
                      className="text-[#2563EB] underline"
                      onClick={() =>
                        router.push(`/admin/articles/edit/${article.id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      className="text-red-500 underline"
                      onClick={() => toast.error("Delete not implemented")}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {/* <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div> */}

          {totalPages >= 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
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
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </Card>
      </div>
    </div>
  );
}
