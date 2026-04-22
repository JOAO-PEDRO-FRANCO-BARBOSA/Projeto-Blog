import Link from 'next/link';
import { formatDate, readingTime } from '@/lib/utils';
import { Post } from '@/lib/db';
import { SafeImage } from '@/components/SafeImage';

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
}

export function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const readTime = readingTime(post.content);

  if (featured) {
    return (
      <article className="group">
        <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-lg">
          <div className="relative h-80 w-full overflow-hidden bg-gray-800">
            <SafeImage
              src={post.image || '/images/fallback-placeholder.svg'}
              fallbackSrc="/images/fallback-placeholder.svg"
              alt={post.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium">
              {post.category}
            </span>
            <span>{formatDate(post.created_at)}</span>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{post.excerpt}</p>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Por {post.author}</span>
            <span>{readTime} min de leitura</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-lg border border-gray-800 bg-gray-900 hover:shadow-lg transition">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
        <div className="relative h-48 w-full bg-gray-800">
          <SafeImage
            src={post.image || '/images/fallback-placeholder.svg'}
            fallbackSrc="/images/fallback-placeholder.svg"
            alt={post.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
            {post.category}
          </span>
          <span className="text-gray-500 dark:text-gray-400">{formatDate(post.created_at)}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{post.author}</span>
          <span>{readTime} min</span>
        </div>
      </div>
    </article>
  );
}
