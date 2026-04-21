import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { RootLayout } from '@/components/RootLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zentrix | Tecnologia, IA e Produtividade',
  description: 'Conteúdo sobre IA, ferramentas digitais e produtividade para devs, criadores e empreendedores.',
  metadataBase: new URL('https://zentr1xa.com'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://zentr1xa.com',
    siteName: 'Zentrix',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RootLayout>{children}</RootLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
