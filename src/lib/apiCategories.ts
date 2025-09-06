/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axios";

export async function getCategories() {
  try {
    const res = await api.get("/categories");

    // ✅ PERBAIKAN: Filter categories dengan id kosong
    const filteredCategories = res.data.data.filter((category: any) => {
      return category.id 
    });

    console.log("🔍 Original categories:", res.data.data.length);
    console.log("🔍 Filtered categories:", filteredCategories.length);
    console.log(
      "🔍 Removed empty IDs:",
      res.data.data.length - filteredCategories.length
    );

    return filteredCategories;
  } catch (error: any) {
    console.error("Error getCategories:", error);
    return [];
  }
}

// ✅ Create category
export async function createCategory(name: string) {
  try {
    const res = await api.post("/categories", { name });
    console.log("✅ Category created:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error createCategory:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create category"
    );
  }
}

// ✅ Update category
export async function updateCategory(id: string, payload: any) {
  try {
    const res = await api.put(`/categories/${id}`, payload);
    return res.data;
  } catch (error: any) {
    console.error("Error updateCategory:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update category"
    );
  }
}

// ✅ Delete category
export async function deleteCategory(id: string) {
  try {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Error deleteCategory:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete category"
    );
  }
}
