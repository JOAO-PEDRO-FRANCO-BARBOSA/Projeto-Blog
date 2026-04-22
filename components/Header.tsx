'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { SafeImage } from '@/components/SafeImage';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Zentrixa Home">
          <SafeImage
            src="/Zentrixa_Logo.png"
            fallbackSrc="/images/fallback-placeholder.svg"
            alt="Zentrixa"
            width={170}
            height={40}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            Blog
          </Link>
          <Link
            href="/ferramentas"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            Ferramentas
          </Link>
          <Link
            href="/sobre"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            Sobre
          </Link>
        </div>

        {/* CTA + Dark Mode */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link
            href="/blog"
            className="hidden sm:inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Ler artigos
          </Link>
        </div>
      </nav>
    </header>
  );
}
