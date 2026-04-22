import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { SearchBox } from '@/components/SearchBox';
import { getCategories, getPosts } from '@/lib/db';

type BlogPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedCategory = resolvedSearchParams?.category;

  const [categoriesResult, postsResult] = await Promise.all([
    getCategories(),
    getPosts(24, 0, selectedCategory),
  ]);

  const categories = categoriesResult.data;
  const posts = postsResult.data;

  return (
    <div>
      <div className="bg-gray-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Todos os artigos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Conteúdo prático e direto ao ponto sobre tecnologia, IA e produtividade.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Buscar</h3>
                <SearchBox />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categorias</h3>
                <div className="space-y-2">
                  <Link
                    href="/blog"
                    className={`block w-full rounded-lg px-3 py-2 text-left transition ${
                      !selectedCategory
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Todos
                  </Link>

                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/blog?category=${cat.slug}`}
                      className={`block w-full rounded-lg px-3 py-2 text-left transition ${
                        selectedCategory === cat.slug
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Populares</h3>
                <div className="space-y-3">
                  {posts.slice(0, 3).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Nenhum artigo encontrado para esta categoria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
