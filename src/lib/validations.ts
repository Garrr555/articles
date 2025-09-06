import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  category: z.string().nonempty("Kategori wajib dipilih"),
});


export type ArticleFormData = z.infer<typeof articleSchema>;