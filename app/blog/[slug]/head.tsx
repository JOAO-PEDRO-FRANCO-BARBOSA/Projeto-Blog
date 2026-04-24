import { getPostBySlug } from '@/lib/db';
import { type ArticleJsonLd, type FAQPageJsonLd, SEO_CONFIG } from '@/lib/seo-config';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function absoluteUrl(pathname: string): string {
  return new URL(pathname, SEO_CONFIG.siteUrl).toString();
}

function escapeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function cleanText(value: string): string {
  return value
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFaqEntries(content: string, title: string, excerpt: string, author: string) {
  const blocks = content
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const entries: Array<{ question: string; answer: string }> = [];

  for (const block of blocks) {
    const questionIndex = block.indexOf('?');

    if (questionIndex <= 0) {
      continue;
    }

    const question = cleanText(block.slice(0, questionIndex + 1));
    const answer = cleanText(block.slice(questionIndex + 1));

    if (question.length >= 8 && answer.length >= 12) {
      entries.push({ question, answer });
    }

    if (entries.length === 3) {
      break;
    }
  }

  if (entries.length === 0) {
    const readingMinutes = Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200));

    entries.push(
      {
        question: `Sobre o que é ${title}?`,
        answer: cleanText(excerpt || `Este artigo explora o tema central de ${title}.`),
      },
      {
        question: 'Quanto tempo leva para ler este artigo?',
        answer: `${readingMinutes} min de leitura.`,
      },
      {
        question: 'Quem é o autor deste conteúdo?',
        answer: `O conteúdo foi publicado por ${author || SEO_CONFIG.author}.`,
      }
    );
  }

  return entries.slice(0, 3);
}

export default async function Head({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const postResult = await getPostBySlug(slug);
  const post = postResult.data;

  if (!post) {
    return null;
  }

  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const imageUrl = post.image ? absoluteUrl(post.image) : absoluteUrl('/og-image.jpg');

  const articleJsonLd: ArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [imageUrl],
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author || SEO_CONFIG.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(SEO_CONFIG.logo),
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords: post.keywords || undefined,
    articleSection: post.category || undefined,
  };

  const faqJsonLd: FAQPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: extractFaqEntries(post.content, post.title, post.excerpt, post.author).map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  };

  // JSON-LD injection for Article and FAQPage happens here inside <head>.
  return (
    <>
      <script id="article-json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(articleJsonLd) }} />
      <script id="faq-json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(faqJsonLd) }} />
    </>
  );
}