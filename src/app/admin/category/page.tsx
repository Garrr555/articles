/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/apiCategories";
import { Loader2Icon, Search } from "lucide-react";
import { Label } from "@/components/ui/label";

type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // state untuk form add/edit
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // state untuk delete dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    categoryId: "",
    categoryName: "",
    isDeleting: false,
  });

  const [searchTerm, setSearchTerm] = useState("");

  // fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // tambah kategori
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }
    try {
      await createCategory(newCategory);
      toast.success("Kategori berhasil ditambahkan");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan kategori");
    }
  };

  // update kategori
  const handleUpdateCategory = async () => {
    if (!editCategory?.name.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }
    try {
      setLoading(true);
      await updateCategory(editCategory.id, { name: editCategory.name });
      toast.success("Kategori berhasil diperbarui");
      setEditCategory(null);
      fetchCategories();
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui kategori");
    }
  };

  // hapus kategori
  const handleDeleteConfirm = async () => {
    try {
      setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
      await deleteCategory(deleteDialog.categoryId);
      toast.success("Kategori berhasil dihapus");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus kategori");
    } finally {
      setDeleteDialog({
        isOpen: false,
        categoryId: "",
        categoryName: "",
        isDeleting: false,
      });
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Navbar */}
      <div className="bg-white">
        <Navbar useName name={"Categories"} />
      </div>

      <div className="p-6">
        <Card className="border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold px-6">Category Management</h2>
          </div>

          {/* Search + Add Button */}
          <div className="flex justify-between items-center gap-2 mb-6 px-6">
            <div className="relative w-1/4 max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search category"
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Pop-up Tambah Kategori */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-blue-600">+ Add Category</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-96">
                <AlertDialogHeader>
                  <AlertDialogTitle className="mb-5">
                    Add Category
                  </AlertDialogTitle>
                </AlertDialogHeader>

                <div className="space-y-2 mb-8">
                  <Label>Category</Label>
                  <Input
                    placeholder="Input Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>

                <AlertDialogFooter className="flex justify-end gap-2">
                  {/* Cancel button */}
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>

                  {/* Save button */}
                  <Button onClick={handleAddCategory} className="bg-blue-600">
                    Add
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Created at</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="text-center text-slate-600">
                      {editCategory?.id === cat.id ? (
                        <Input
                          value={editCategory.name}
                          onChange={(e) =>
                            setEditCategory({
                              ...editCategory,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        cat.name
                      )}
                    </TableCell>
                    <TableCell className="text-center text-slate-600">
                      {new Date(cat.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      {/* Tombol Edit (memicu pop-up) */}
                      <AlertDialog
                        open={!!editCategory && editCategory.id === cat.id}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="link"
                            className="text-blue-600 underline"
                            onClick={() => setEditCategory(cat)}
                          >
                            Edit
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="w-96">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="mb-5">
                              Edit Category
                            </AlertDialogTitle>
                          </AlertDialogHeader>

                          <div className="space-y-2 mb-8">
                            <Label>Category</Label>
                            <Input
                              placeholder="Input Category"
                              value={editCategory?.name || ""}
                              onChange={(e) =>
                                setEditCategory((prev) =>
                                  prev
                                    ? { ...prev, name: e.target.value }
                                    : null
                                )
                              }
                            />
                          </div>

                          <AlertDialogFooter className="flex justify-end gap-2">
                            <AlertDialogCancel asChild>
                              <Button
                                variant="outline"
                                onClick={() => setEditCategory(null)}
                              >
                                Cancel
                              </Button>
                            </AlertDialogCancel>

                            <Button
                              onClick={handleUpdateCategory}
                              className="bg-blue-600"
                            >
                              {loading ? (
                                <Loader2Icon className="animate-spin" />
                              ) : (
                                "Save"
                              )}
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Tombol Delete tetap di sini */}
                      <Button
                        size="sm"
                        variant="link"
                        className="text-red-600 underline"
                        onClick={() =>
                          setDeleteDialog({
                            isOpen: true,
                            categoryId: cat.id,
                            categoryName: cat.name,
                            isDeleting: false,
                          })
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteDialog.isOpen}
          onOpenChange={() =>
            setDeleteDialog({
              isOpen: false,
              categoryId: "",
              categoryName: "",
              isDeleting: false,
            })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Delete category “{" "}
                <span className="font-semibold">
                  {deleteDialog.categoryName}
                </span>
                ”? This will remove it from master data permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteDialog.isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={deleteDialog.isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteDialog.isDeleting ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
