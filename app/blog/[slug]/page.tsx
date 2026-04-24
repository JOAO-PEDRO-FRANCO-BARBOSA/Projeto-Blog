import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { CommentsSection } from '@/components/CommentsSection';
import { SafeImage } from '@/components/SafeImage';
import {
  generateArticleMetadata,
  generateFallbackMetadata,
} from '@/lib/seo-config';
import { formatDate, readingTime } from '@/lib/utils';
import { getApprovedComments, getPostBySlug, getRelatedPosts } from '@/lib/db';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function stripMarkdownSyntax(value: string): string {
  return value
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderStructuredContent(content: string) {
  const blocks = content
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const hasHeading = blocks.some((block) => /^#{1,6}\s+/.test(block));

  const renderedBlocks = blocks.flatMap((block, index) => {
    const headingMatch = block.match(/^(#{1,6})\s+(.*)$/);

    if (headingMatch) {
      const level = headingMatch[1].length <= 2 ? 'h2' : 'h3';
      const headingText = stripMarkdownSyntax(headingMatch[2]);

      if (level === 'h2') {
        return [
          <h2 key={`heading-${index}`} className="mt-10 scroll-mt-28 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {headingText}
          </h2>,
        ];
      }

      return [
        <h3 key={`heading-${index}`} className="mt-8 scroll-mt-28 text-xl font-bold text-slate-900 dark:text-slate-100">
          {headingText}
        </h3>,
      ];
    }

    return [
      <p key={`paragraph-${index}`} className="whitespace-pre-line leading-8 text-slate-700 dark:text-slate-300">
        {stripMarkdownSyntax(block)}
      </p>,
    ];
  });

  if (hasHeading) {
    return renderedBlocks;
  }

  return [
    <h2 key="content-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
      Conteúdo do artigo
    </h2>,
    ...renderedBlocks,
  ];
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const postResult = await getPostBySlug(slug);
    const post = postResult.data;

    if (!post) {
      return generateFallbackMetadata();
    }

    return generateArticleMetadata({
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      image: post.image || undefined,
      author: post.author,
      publishedAt: post.created_at,
    });
  } catch {
    return generateFallbackMetadata();
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const postResult = await getPostBySlug(slug);
  const post = postResult.data;

  if (!post) {
    notFound();
  }

  const [relatedPostsResult, commentsResult] = await Promise.all([
    getRelatedPosts(post, 3),
    getApprovedComments(post.id),
  ]);

  const relatedPosts = relatedPostsResult.data;
  const comments = commentsResult.data;

  return (
    <article>
      <header className="border-b border-gray-800 bg-gray-950 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Voltar para o blog
          </Link>

          <h1 className="mt-6 text-4xl font-bold text-slate-900 dark:text-slate-100 sm:text-5xl">{post.title}</h1>

          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {post.category || 'Geral'}
            </span>
            <span>{formatDate(post.created_at)}</span>
            <span>{readingTime(post.content)} min de leitura</span>
            <span>Por {post.author}</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative mb-8 h-64 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-96 dark:border-slate-800 dark:bg-slate-900">
          <SafeImage
            src={post.image || '/images/fallback-placeholder.svg'}
            fallbackSrc="/images/fallback-placeholder.svg"
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
            priority
          />
        </div>

        <div className="prose max-w-none text-slate-700 dark:prose-invert dark:text-slate-300">
          {renderStructuredContent(post.content)}
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-slate-100">Artigos relacionados</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <ArticleCard key={related.id} post={related} />
            ))}
          </div>
        </section>
      )}

      <CommentsSection postId={post.id} initialComments={comments} />
    </article>
  );
}
