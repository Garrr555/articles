/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";

export default function ArticleCard({ article }: { article: any }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold">{article.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3 mt-2">
        {article.content}
      </p>
      <div className="mt-3 flex justify-between items-center">
        <Link href={`/articles/${article.id}`} className="text-sky-600">
          Read more
        </Link>
        <span className="text-xs text-gray-500">
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
