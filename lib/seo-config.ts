export const SEO_CONFIG = {
  siteName: 'Zentrixa',
  siteUrl: 'https://zentr1xa.com',
  description: 'Conteúdo sobre IA, ferramentas digitais e produtividade para devs, criadores e empreendedores.',
  author: 'Zentrixa',
  locale: 'pt-BR',
  logo: '/logo.svg',
};

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
) {
  return {
    title: `${title} | ${SEO_CONFIG.siteName}`,
    description,
    canonical: canonical || `${SEO_CONFIG.siteUrl}`,
    openGraph: {
      title,
      description,
      url: canonical || SEO_CONFIG.siteUrl,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: ogImage || `${SEO_CONFIG.siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
      locale: SEO_CONFIG.locale,
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
}) {
  const url = `${SEO_CONFIG.siteUrl}/blog/${article.slug}`;
  return {
    title: `${article.title} | ${SEO_CONFIG.siteName}`,
    description: article.excerpt,
    canonical: url,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: 'article',
      images: [
        {
          url: article.image || `${SEO_CONFIG.siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
        },
      ],
      article: {
        publishedTime: article.publishedAt,
        authors: [article.author || SEO_CONFIG.author],
      },
    },
  };
}
