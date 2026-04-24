import type { Metadata } from 'next';

export const SEO_CONFIG = {
  siteName: 'Zentrixa',
  siteUrl: 'https://zentr1xa.com',
  description: 'Conteúdo sobre IA, ferramentas digitais e produtividade para devs, criadores e empreendedores.',
  author: 'Zentrixa',
  locale: 'pt-BR',
  logo: '/logo.svg',
} as const;

export const DEFAULT_SEO_TITLE = `${SEO_CONFIG.siteName} Blog`;
export const DEFAULT_SEO_DESCRIPTION = SEO_CONFIG.description;

export interface SchemaOrgBase {
  '@context': 'https://schema.org';
  '@type': string;
}

export interface SchemaOrgImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
}

export interface SchemaOrgPerson {
  '@type': 'Person';
  name: string;
  url?: string;
}

export interface SchemaOrgOrganization {
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: string | SchemaOrgImageObject;
}

export interface SchemaOrgWebPage {
  '@type': 'WebPage';
  '@id': string;
}

export interface SchemaOrgQuestion {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

export interface ArticleJsonLd extends SchemaOrgBase {
  '@type': 'Article';
  headline: string;
  description: string;
  image?: string | string[] | SchemaOrgImageObject[];
  datePublished: string;
  dateModified?: string;
  author: SchemaOrgPerson | SchemaOrgPerson[];
  publisher?: SchemaOrgOrganization;
  mainEntityOfPage: SchemaOrgWebPage;
  keywords?: string[];
  articleSection?: string;
}

export interface FAQPageJsonLd extends SchemaOrgBase {
  '@type': 'FAQPage';
  mainEntity: SchemaOrgQuestion[];
}

export const CATEGORIES = {
  ai: {
    name: 'Inteligência Artificial',
    slug: 'inteligencia-artificial',
    description: 'Ferramentas e tutoriais sobre IA e machine learning',
  },
  tools: {
    name: 'Ferramentas Digitais',
    slug: 'ferramentas-digitais',
    description: 'Discover the best digital tools to boost your productivity',
  },
  productivity: {
    name: 'Produtividade',
    slug: 'produtividade',
    description: 'Métodos, dicas e ferramentas para aumentar sua produtividade',
  },
  programming: {
    name: 'Programação',
    slug: 'programacao',
    description: 'Tutoriais, extensões e guias para programadores',
  },
};

export function generateMetadata(
  title: string,
  description: string,
  ogImage?: string,
  canonical?: string
): Metadata {
  const url = canonical || SEO_CONFIG.siteUrl;
  const imageUrl = ogImage || `${SEO_CONFIG.siteUrl}/og-image.jpg`;

  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    title: `${title} | ${SEO_CONFIG.siteName}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      locale: SEO_CONFIG.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    },
  };
}

export function generateArticleMetadata(article: {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  author?: string;
  publishedAt?: string;
}): Metadata {
  const url = `${SEO_CONFIG.siteUrl}/blog/${article.slug}`;
  const imageUrl = article.image || `${SEO_CONFIG.siteUrl}/og-image.jpg`;

  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    title: `${article.title} | ${SEO_CONFIG.siteName}`,
    description: article.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author || SEO_CONFIG.author],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
  };
}

export function generateFallbackMetadata(): Metadata {
  const imageUrl = `${SEO_CONFIG.siteUrl}/og-image.jpg`;

  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
    alternates: {
      canonical: SEO_CONFIG.siteUrl,
    },
    openGraph: {
      title: DEFAULT_SEO_TITLE,
      description: DEFAULT_SEO_DESCRIPTION,
      url: SEO_CONFIG.siteUrl,
      siteName: SEO_CONFIG.siteName,
      type: 'website',
      locale: SEO_CONFIG.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: SEO_CONFIG.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: DEFAULT_SEO_TITLE,
      description: DEFAULT_SEO_DESCRIPTION,
      images: [imageUrl],
    },
  };
}
