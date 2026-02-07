import type { Metadata } from 'next';
import { sanityClient } from '../lib/sanity.client';
import { latestNewsQuery } from '../lib/queries';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nyheter',
};

type News = {
  _id: string;
  title: string;
  slug: string;
  date: string;
  publishedAt: string;
  body: string;
  featuredImage: {
    asset: {
      url: string;
    };
    alt: string;
  };
};

export default async function News() {
  const news = await sanityClient.fetch<News[]>(latestNewsQuery);
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Nyheter</h1>
      <div className="grid gap-8 sm:grid-cols-2">
        {news.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            {post.featuredImage?.asset?.url && (
              <img
                src={post.featuredImage.asset.url}
                alt={post.featuredImage.alt || post.title}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-500 text-sm mb-4">
                {new Date(post.date).toLocaleDateString("nb-NO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-6 line-clamp-3">{post.body}</p>
              <div className="mt-auto">
                <Link
                  href={`/news/${post.slug}`}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Les mer
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
