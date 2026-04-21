'use client';

import { useState, useEffect } from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import { SearchBox } from '@/components/SearchBox';
import { CATEGORIES } from '@/lib/seo-config';

// Mock data
const mockPosts = [
  {
    id: '1',
    title: 'VS Code: 15 Extensões Essenciais para Programadores Iniciantes',
    slug: 'vs-code-15-extensoes-essenciais',
    excerpt: 'Descubra as 15 extensões mais úteis do VS Code que todo programador iniciante deveria usar para aumentar sua produtividade.',
    content: 'Lorem ipsum...',
    category: 'Programação',
    image: '/images/article-1.jpg',
    author: 'Zentrix',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: '10 Ferramentas de IA Gratuitas para Aumentar sua Produtividade em 2025',
    slug: '10-ferramentas-ia-gratuitas-2025',
    excerpt: 'Explore 10 ferramentas de IA que você pode usar gratuitamente para melhorar sua produtividade como dev ou criador de conteúdo.',
    content: 'Lorem ipsum...',
    category: 'Inteligência Artificial',
    image: '/images/article-2.jpg',
    author: 'Zentrix',
    published: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Como Ganhar Dinheiro com ChatGPT: 7 Métodos Comprovados em 2025',
    slug: 'ganhar-dinheiro-chatgpt-7-metodos',
    excerpt: 'Descubra 7 formas práticas e comprovadas de ganhar dinheiro usando ChatGPT em 2025.',
    content: 'Lorem ipsum...',
    category: 'Inteligência Artificial',
    image: '/images/article-3.jpg',
    author: 'Zentrix',
    published: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredPosts(mockPosts.filter((post) => post.category === selectedCategory));
    } else {
      setFilteredPosts(mockPosts);
    }
  }, [selectedCategory]);

  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Todos os artigos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Conteúdo prático e direto ao ponto sobre tecnologia, IA e produtividade.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Buscar</h3>
                <SearchBox />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categorias</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === null
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Todos
                  </button>
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === cat.name
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Articles */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Populares</h3>
                <div className="space-y-3">
                  {mockPosts.slice(0, 3).map((post) => (
                    <a
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                    >
                      {post.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Nenhum artigo encontrado nessa categoria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
