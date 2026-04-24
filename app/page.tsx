import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { getCategories, getPosts } from '@/lib/db';
import { SafeImage } from '@/components/SafeImage';

export default async function Home() {
  const [postsResult, categoriesResult] = await Promise.all([
    getPosts(6, 0),
    getCategories(),
  ]);

  const posts = postsResult.data;
  const categories = categoriesResult.data;

  return (
    <div>
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              Novidades em IA toda semana
            </span>
            <h1 className="mt-5 text-5xl font-bold text-slate-900 dark:text-white sm:text-6xl">
              Tecnologia que{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                acelera
              </span>{' '}
              sua produtividade.
            </h1>
            <p className="mt-6 max-w-xl text-xl text-slate-600 dark:text-slate-300">
              Reviews honestas de IA, ferramentas e métodos que realmente funcionam para devs, criadores e empreendedores digitais.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/blog"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-center"
              >
                Explorar artigos →
              </Link>
              <Link
                href="/ferramentas"
                className="px-8 py-3 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition font-medium text-center"
              >
                Ver ferramentas
              </Link>
            </div>
          </div>

          <div className="relative h-72 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl sm:h-96 dark:border-slate-800 dark:bg-slate-900">
            <SafeImage
              src="/Foto_Programação.jpeg"
              fallbackSrc="/images/fallback-placeholder.svg"
              alt="Programação em destaque"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Explore por categoria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className="p-6 rounded-lg border border-gray-800 bg-gray-900 hover:shadow-lg hover:border-blue-700 transition"
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{cat.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{cat.description || 'Conteúdos selecionados para acelerar resultados.'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Últimos artigos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
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

    </div>
  );
}
