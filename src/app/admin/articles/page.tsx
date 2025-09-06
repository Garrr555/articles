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
import { getArticles, deleteArticle } from "@/lib/apiArticles";
import { getCategories } from "@/lib/apiCategories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

type Category = {
  id: string;
  name: string;
};

export default function AdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);

  // Articles and pagination states
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Loading state untuk articles
  const [articlesLoading, setArticlesLoading] = useState(false);

  // Delete confirmation states
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    articleId: "",
    articleTitle: "",
    isDeleting: false,
  });

  // Debounce untuk search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const router = useRouter();

  // Fetch categories saat component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        console.log("Categories loaded:", data);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Gagal memuat kategori");
      }
    };

    fetchCategories();
  }, []);

  // Fetch profile and check authorization
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

  // Enhanced fetch articles dengan proper parameters
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setArticlesLoading(true);

        // Build parameters dengan benar
        const params: any = {
          page,
          limit,
        };

        // Hanya tambahkan search jika ada value
        if (appliedSearch.trim()) {
          params.search = appliedSearch.trim();
        }

        // Gunakan category ID, bukan hardcoded value
        if (category !== "all") {
          params.category = category;
        }

        console.log("Fetching articles with params:", params);

        const res = await getArticles(params);
        console.log("Articles response:", res);

        setArticles(res.data || []);
        setTotal(res.total || 0);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        toast.error("Gagal memuat artikel");
      } finally {
        setArticlesLoading(false);
      }
    };

    if (profile) {
      fetchArticles();
    }
  }, [page, limit, appliedSearch, category, profile]);

  // Debounced search handler
  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      setAppliedSearch(value);
      setPage(1);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  // Category change handler
  const handleCategoryChange = (value: string) => {
    console.log("Category changed to:", value);
    setCategory(value);
    setPage(1);
  };

  // Delete handlers
  const handleDeleteClick = (articleId: string, articleTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      articleId,
      articleTitle,
      isDeleting: false,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      articleId: "",
      articleTitle: "",
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.articleId) return;

    try {
      setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));

      console.log("Deleting article:", deleteDialog.articleId);
      await deleteArticle(deleteDialog.articleId);

      toast.success("Artikel berhasil dihapus!");

      // Refresh articles setelah delete
      const params: any = {
        page,
        limit,
      };

      if (appliedSearch.trim()) {
        params.search = appliedSearch.trim();
      }

      if (category !== "all") {
        params.category = category;
      }

      const res = await getArticles(params);
      setArticles(res.data || []);
      setTotal(res.total || 0);

      // Handle pagination jika halaman current kosong setelah delete
      const newTotalPages = Math.ceil((res.total || 0) / limit);
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      }
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Gagal menghapus artikel");
    } finally {
      setDeleteDialog({
        isOpen: false,
        articleId: "",
        articleTitle: "",
        isDeleting: false,
      });
    }
  };

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
        <Card className="border">
          <div className="flex flex-col justify-center gap-5 items-center mb-4">
            <div className="border-b w-full px-5 pb-5">
              <p className="text-lg font-semibold">
                Total Articles: {total}
                {appliedSearch && ` (filtered by "${appliedSearch}")`}
                {category !== "all" &&
                  ` (category: ${
                    categories.find((cat) => cat.id === category)?.name ||
                    category
                  })`}
              </p>
            </div>
            <div className="flex justify-between items-center w-full px-6">
              <div className="flex gap-2 items-center">
                {/* Dynamic category options */}
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-white min-w-[200px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Debounced search input */}
                <div className="flex px-2 items-center rounded-lg border min-w-[300px]">
                  <Search className="text-gray-300" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchInput}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Loading indicator */}
                {articlesLoading && (
                  <div className="text-sm text-gray-500">Loading...</div>
                )}
              </div>

              <Button
                className="bg-[#2563EB]"
                onClick={() => router.push("/admin/articles/add")}
              >
                + Add Articles
              </Button>
            </div>
          </div>

          <Table>
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
              {articlesLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
                      <span className="ml-2">Loading articles...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-gray-500">
                      {appliedSearch || category !== "all"
                        ? "No articles found matching your filters"
                        : "No articles found"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                articles.map((article) => (
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
                    <TableCell className="space-y-2 font-medium max-w-54 overflow-auto">
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
                        onClick={() =>
                          handleDeleteClick(article.id, article.title)
                        }
                      >
                        {loading ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Smart pagination display */}
                {Array.from({ length: Math.min(totalPages, 10) }).map(
                  (_, i) => {
                    const pageNum = i + 1;
                    const showPage =
                      pageNum <= 3 ||
                      pageNum >= totalPages - 2 ||
                      (pageNum >= page - 1 && pageNum <= page + 1);

                    if (!showPage && pageNum === 4 && page > 6) {
                      return (
                        <PaginationItem key="ellipsis1">
                          <span className="px-3 py-2">...</span>
                        </PaginationItem>
                      );
                    }

                    if (
                      !showPage &&
                      pageNum === totalPages - 3 &&
                      page < totalPages - 5
                    ) {
                      return (
                        <PaginationItem key="ellipsis2">
                          <span className="px-3 py-2">...</span>
                        </PaginationItem>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={page === pageNum}
                          onClick={() => setPage(pageNum)}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* Show pagination info */}
          {totalPages > 0 && (
            <div className="flex justify-center mt-4 text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} articles
            </div>
          )}
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteDialog.isOpen}
          onOpenChange={handleDeleteCancel}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-semibold">
                Delete Article
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p className="text-[#64748B]">
                  Deleting this article is permanent and cannot be undone. All
                  related content will be removed.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteDialog.isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={deleteDialog.isDeleting}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {deleteDialog.isDeleting ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Delete Article"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
