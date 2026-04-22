import Link from 'next/link';
import { CATEGORIES } from '@/lib/seo-config';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Zentrixa</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Conteúdo sobre IA, ferramentas digitais e produtividade para devs, criadores e empreendedores.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Categorias</h4>
            <ul className="space-y-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <li key={key}>
                  <Link
                    href={`/blog?category=${cat.slug}`}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition text-sm"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/ferramentas" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition text-sm">
                  Ferramentas
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition text-sm">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Siga-nos</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2026 Zentrixa. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
