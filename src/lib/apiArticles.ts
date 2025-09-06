/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import api from "./axios";

export const getArticles = async (params?: {
  articleId?: string;
  userId?: string;
  title?: string;
  category?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await api.get("/articles", { params });
  return res.data;
};

export const getArticleById = async (id: string) => {
  const res = await api.get(`/articles/${id}`);
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

// 🔍 ENHANCED DEBUG VERSION
export async function createArticle(article: {
  title: string;
  content: string;
  categoryId: string;
}) {
  try {
    // 🔍 Debug: Check token
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    console.log("🔍 Token exists:", !!token);
    console.log(
      "🔍 Token preview:",
      token ? `${token.substring(0, 20)}...` : "None"
    );

    // 🔍 Debug: Request data
    console.log("🔍 Request payload:", article);
    console.log("🔍 API Base URL:", api.defaults.baseURL);

    const res = await api.post("/articles", article);

    // 🔍 Debug: Success response
    console.log("✅ Success response:", res.status, res.data);

    return res.data;
  } catch (error: any) {
    // 🔍 Enhanced error logging
    console.error("❌ Create article failed:");
    console.error("- Status:", error.response?.status);
    console.error("- Status Text:", error.response?.statusText);
    console.error("- Response Data:", error.response?.data);
    console.error("- Request URL:", error.config?.url);
    console.error("- Request Method:", error.config?.method);
    console.error("- Request Headers:", error.config?.headers);
    console.error("- Full Error:", error);

    // 🔍 Better error messages
    let errorMessage = "Gagal create article";

    if (error.response?.status === 401) {
      errorMessage = "Authentication gagal. Silakan login ulang.";
    } else if (error.response?.status === 403) {
      errorMessage = "Tidak memiliki permission untuk membuat artikel.";
    } else if (error.response?.status === 400) {
      errorMessage = error.response?.data?.message || "Data tidak valid.";
    } else if (error.response?.status === 422) {
      errorMessage = error.response?.data?.message || "Validasi gagal.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}

export const updateArticle = async (
  id: string,
  payload: {
    title: string;
    content: string;
    categoryId: string;
  }
) => {
  try {
    const res = await api.put(`/articles/${id}`, payload);
    return res.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Gagal update artikel";
    throw new Error(errorMessage);
  }
};

export async function deleteArticle(id: string) {
  try {
    console.log("🔍 Deleting article with ID:", id);
    const res = await api.delete(`/articles/${id}`);
    console.log("✅ Article deleted successfully:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Delete article failed:", error);
    
    let errorMessage = "Gagal menghapus artikel";
    
    if (error.response?.status === 401) {
      errorMessage = "Authentication gagal. Silakan login ulang.";
    } else if (error.response?.status === 403) {
      errorMessage = "Tidak memiliki permission untuk menghapus artikel.";
    } else if (error.response?.status === 404) {
      errorMessage = "Artikel tidak ditemukan.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }}
