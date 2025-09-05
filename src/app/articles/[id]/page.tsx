"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArticleById } from "@/lib/apiArticles";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/view/Footer";
import Navbar from "@/components/view/Navbar";
import Image from "next/image";
import RandomArticles from "@/components/view/RandomArticles";

type Article = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: { id: string; name: string };
  user: { id: string; username: string; role: string };
  image: string;
};

export default function ArticleDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const res = await getArticleById(id as string);
        setArticle(res);
      } catch (err) {
        console.error("Failed to fetch article", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!article) return <p className="p-6">Article not found.</p>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <div className="text-[#475569] font-semibold flex text-[16px] gap-1 sm:gap-3 justify-center items-center">
              <div className="">
                {new Date(article.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div>• </div>
              <div className="">Created By {article.user?.username}</div>
            </div>

            <CardTitle className="mb-10 text-[30px] font-bold mx-auto text-center max-w-[600px]">
              {article.title}
            </CardTitle>
            <Image
              src={article.image || "/artikel.svg"}
              alt={article.title}
              width={600}
              height={400}
              className="rounded-xl w-full max-h-[400px] object-center object-cover"
            />
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p>{article.content}</p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-10">
          <p className="font-semibold text-xl mx-5">
            Other Articles
          </p>
          <RandomArticles />
        </div>
      </div>
      <Footer />
    </div>
  );
}
