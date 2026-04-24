/* eslint-disable @next/next/next-script-for-ga */
import type { Metadata } from 'next';
import { RootLayout } from '@/components/RootLayout';
import { SEO_CONFIG } from '@/lib/seo-config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.siteUrl),
  title: {
    default: SEO_CONFIG.siteName,
    template: `%s | ${SEO_CONFIG.siteName}`,
  },
  description: SEO_CONFIG.description,
  applicationName: SEO_CONFIG.siteName,
  authors: [{ name: SEO_CONFIG.author }],
  creator: SEO_CONFIG.author,
  publisher: SEO_CONFIG.siteName,
  alternates: {
    canonical: SEO_CONFIG.siteUrl,
  },
  openGraph: {
    title: SEO_CONFIG.siteName,
    description: SEO_CONFIG.description,
    type: 'website',
    locale: 'pt_BR',
    url: SEO_CONFIG.siteUrl,
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: `${SEO_CONFIG.siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SEO_CONFIG.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.siteName,
    description: SEO_CONFIG.description,
    images: [`${SEO_CONFIG.siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-T3PSM5LKQ3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T3PSM5LKQ3');
            `,
          }}
        />
      </head>
      <body className="bg-gray-950 text-gray-100">
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
