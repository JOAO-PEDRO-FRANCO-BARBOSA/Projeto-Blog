import type { Metadata } from 'next';
import { RootLayout } from '@/components/RootLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zentrixa | Tecnologia, IA e Produtividade',
  description: 'Conteúdo sobre IA, ferramentas digitais e produtividade para devs, criadores e empreendedores.',
  metadataBase: new URL('https://zentr1xa.com'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://zentr1xa.com',
    siteName: 'Zentrixa',
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
