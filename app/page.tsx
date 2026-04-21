import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { NewsletterForm } from '@/components/NewsletterForm';
import { CATEGORIES } from '@/lib/seo-config';

// Mock data - substituir por dados reais do Supabase
const mockPosts = [
  {
    id: '1',
    title: 'VS Code: 15 Extensões Essenciais para Programadores Iniciantes',
    slug: 'vs-code-15-extensoes-essenciais',
    excerpt: 'Descubra as 15 extensões mais úteis do VS Code que todo programador iniciante deveria usar para aumentar sua produtividade.',
    content: 'Lorem ipsum dolor sit amet...',
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
    content: 'Lorem ipsum dolor sit amet...',
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
    content: 'Lorem ipsum dolor sit amet...',
    category: 'Inteligência Artificial',
    image: '/images/article-3.jpg',
    author: 'Zentrix',
    published: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl">
            Tecnologia que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">acelera</span> sua produtividade.
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Resenhas honestas da IA, ferramentas e métodos que realmente funcionam para devs, criadores e empreendedores digitais.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Explorar artigos →
            </Link>
            <Link
              href="/ferramentas"
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition font-medium"
            >
              Ver ferramentas
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 h-96 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-xl font-semibold">Imagem Hero - Substituir com imagem real</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Explore por categoria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Link
                key={key}
                href={`/blog?category=${cat.slug}`}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition"
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{cat.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Últimos artigos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition font-medium"
          >
            Ver todos os artigos →
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Receba as melhores ferramentas e dicas na sua caixa de entrada
            </h2>
            <p className="text-blue-100 mb-8">
              Sem spam, só conteúdo de qualidade. Desinscrever é fácil.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
