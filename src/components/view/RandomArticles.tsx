"use client";

import { getArticles } from "@/lib/apiArticles";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";

type Article = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: { id: string; name: string };
  user: { id: string; username: string; role: string };
  image: string;
};

function RandomArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // ambil semua artikel (misal max 100 biar nggak berat)
        const res = await getArticles({ limit: 100 });
        const allArticles = res.data || [];

        // acak array
        const shuffled = [...allArticles].sort(() => 0.5 - Math.random());

        // ambil 3 teratas setelah diacak
        setArticles(shuffled.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch articles", err);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Card
          key={article.id}
          className="hover:shadow-md transition cursor-pointer"
          onClick={() => router.push(`/articles/${article.id}`)}
        >
          <CardHeader>
            <CardTitle>
              <Image
                src={article.image || "/artikel.svg"}
                alt={article.title}
                width={600}
                height={300}
                className="w-full h-48 object-cover rounded-md"
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

            <p className="text-[#475569] font-semibold line-clamp-3">
              {article.content}
            </p>
            <div className="flex text-sm text-[#1E3A8A] my-2">
              <p className="bg-[#BFDBFE] py-2 px-3 rounded-full">
                {article.category?.name}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default RandomArticles;
