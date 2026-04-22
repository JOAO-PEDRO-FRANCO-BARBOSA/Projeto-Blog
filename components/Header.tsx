'use client';

import Link from 'next/link';
import { SafeImage } from '@/components/SafeImage';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Zentrixa Home">
          <SafeImage
            src="/Zentrixa_Logo.png"
            fallbackSrc="/images/fallback-placeholder.svg"
            alt="Zentrixa"
            width={320}
            height={96}
            className="h-14 w-auto sm:h-16 lg:h-20"
            priority
          />
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-gray-400 hover:text-white transition"
          >
            Blog
          </Link>
          <Link
            href="/ferramentas"
            className="text-gray-400 hover:text-white transition"
          >
            Ferramentas
          </Link>
          <Link
            href="/sobre"
            className="text-gray-400 hover:text-white transition"
          >
            Sobre
          </Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
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
