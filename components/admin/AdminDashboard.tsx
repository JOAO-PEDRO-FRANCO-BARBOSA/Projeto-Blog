'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardStats {
  posts: number;
  pendingComments: number;
  newsletter: number;
  categories: number;
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    posts: 0,
    pendingComments: 0,
    newsletter: 0,
    categories: 0,
  });

  const loadDashboardStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoriesResponse, postsResponse, commentsResponse, subscribersResponse] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/posts'),
        fetch('/api/admin/comments'),
        fetch('/api/admin/newsletter'),
      ]);

      const [categoriesPayload, postsPayload, commentsPayload, subscribersPayload] = await Promise.all([
        categoriesResponse.json(),
        postsResponse.json(),
        commentsResponse.json(),
        subscribersResponse.json(),
      ]);

      if (!categoriesResponse.ok) {
        throw new Error(categoriesPayload?.error || 'Erro ao carregar categorias.');
      }

      if (!postsResponse.ok) {
        throw new Error(postsPayload?.error || 'Erro ao carregar posts.');
      }

      if (!commentsResponse.ok) {
        throw new Error(commentsPayload?.error || 'Erro ao carregar comentários.');
      }

      if (!subscribersResponse.ok) {
        throw new Error(subscribersPayload?.error || 'Erro ao carregar newsletter.');
      }

      const categories = Array.isArray(categoriesPayload) ? categoriesPayload : [];
      const posts = Array.isArray(postsPayload) ? postsPayload : [];
      const comments = Array.isArray(commentsPayload) ? commentsPayload : [];
      const subscribers = Array.isArray(subscribersPayload) ? subscribersPayload : [];

      setStats({
        posts: posts.length,
        pendingComments: comments.filter((comment) => !comment.approved || !comment.is_approved).length,
        newsletter: subscribers.length,
        categories: categories.length,
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboardStats();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <header className="border-b border-gray-800 pb-4">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-400">
          {loading ? 'A carregar dados...' : 'Resumo geral e atalhos de gestão do painel.'}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Posts', value: stats.posts },
          { label: 'Comentários pendentes', value: stats.pendingComments },
          { label: 'Newsletter', value: stats.newsletter },
          { label: 'Categorias', value: stats.categories },
        ].map((item) => (
          <article key={item.label} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-sm text-gray-400">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
          </article>
        ))}
      </div>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</div>}

      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="text-xl font-semibold">Atalhos</h3>
        <p className="mt-1 text-sm text-gray-400">Aceda rapidamente às páginas de gestão.</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/posts" className="rounded-lg border border-gray-700 px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-gray-800">
            Gerir posts
          </Link>
          <Link href="/admin/comments" className="rounded-lg border border-gray-700 px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-gray-800">
            Gerir comentários
          </Link>
          <Link href="/admin/newsletter" className="rounded-lg border border-gray-700 px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-gray-800">
            Gerir newsletter
          </Link>
          <Link href="/admin/categories" className="rounded-lg border border-gray-700 px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-gray-800">
            Gerir categorias
          </Link>
        </div>
      </section>
    </div>
  );
}
