/* eslint-disable @typescript-eslint/no-explicit-any */
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
}) => {
  const res = await api.get("/articles", { params });
  return res.data; // { data: Article[], total, page, limit }
};

export const getArticleById = async (id: string) => {
  const res = await api.get(`/articles/${id}`);
  return res.data; // {id, title, content, category, user, ...}
};


export const createArticle = (payload: any) =>
  api.post("/articles", payload).then((r) => r.data);
export const updateArticle = (id: string, payload: any) =>
  api.put(`/articles/${id}`, payload).then((r) => r.data);
export const deleteArticle = (id: string) =>
  api.delete(`/articles/${id}`).then((r) => r.data);
