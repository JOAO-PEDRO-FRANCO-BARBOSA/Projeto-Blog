'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminTable } from './AdminTable';
import { formatDate } from '@/lib/utils';

type TabKey = 'posts' | 'comments' | 'newsletter';

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
};

type AdminPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image: string | null;
  category_id: string | null;
  category: string | null;
  category_name?: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type AdminComment = {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  created_at: string;
};

type NewsletterSubscriber = {
  id: string;
  email: string;
  created_at: string;
};

type PostFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  category_id: string;
  published: boolean;
};

const defaultPostForm: PostFormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: 'Zentrixa',
  image: '',
  category_id: '',
  published: false,
};

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('posts');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<PostFormState>(defaultPostForm);

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const loadAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoriesResponse, postsResponse, commentsResponse, subscribersResponse] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/posts'),
        fetch('/api/admin/comments'),
        fetch('/api/admin/newsletter'),
      ]);

      const categoriesPayload = await categoriesResponse.json();
      const postsPayload = await postsResponse.json();
      const commentsPayload = await commentsResponse.json();
      const subscribersPayload = await subscribersResponse.json();

      if (!categoriesResponse.ok) throw new Error(categoriesPayload?.error || 'Erro ao carregar categorias.');
      if (!postsResponse.ok) throw new Error(postsPayload?.error || 'Erro ao carregar posts.');
      if (!commentsResponse.ok) throw new Error(commentsPayload?.error || 'Erro ao carregar comentários.');
      if (!subscribersResponse.ok) throw new Error(subscribersPayload?.error || 'Erro ao carregar newsletter.');

      setCategories(categoriesPayload);
      setPosts(postsPayload);
      setComments(commentsPayload);
      setSubscribers(subscribersPayload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAll();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const resetPostForm = () => {
    setPostForm(defaultPostForm);
    setEditingPostId(null);
  };

  const handleEditPost = (post: AdminPost) => {
    setActiveTab('posts');
    setEditingPostId(post.id);
    setPostForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || 'Zentrixa',
      image: post.image || '',
      category_id: post.category_id || '',
      published: Boolean(post.published),
    });
  };

  const savePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(editingPostId ? `/api/admin/posts/${editingPostId}` : '/api/admin/posts', {
        method: editingPostId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postForm,
          image: postForm.image || null,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao salvar post.');
      }

      setSuccess(editingPostId ? 'Post atualizado com sucesso.' : 'Post criado com sucesso.' );
      resetPostForm();
      await loadAll();
      setActiveTab('posts');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao salvar post.');
    } finally {
      setActionLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Eliminar este post?')) return;
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao eliminar post.');
      }
      setSuccess('Post eliminado.');
      await loadAll();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao eliminar post.');
    } finally {
      setActionLoading(false);
    }
  };

  const approveComment = async (id: string) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao aprovar comentário.');
      }
      setSuccess('Comentário aprovado.');
      await loadAll();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao aprovar comentário.');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Eliminar este comentário?')) return;
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao eliminar comentário.');
      }
      setSuccess('Comentário eliminado.');
      await loadAll();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao eliminar comentário.');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Eliminar este subscritor?')) return;
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao eliminar subscritor.');
      }
      setSuccess('Subscritor eliminado.');
      await loadAll();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao eliminar subscritor.');
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-gray-800 bg-gray-900 px-6 py-6 lg:w-72 lg:border-b-0 lg:border-r">
          <h1 className="text-2xl font-bold">Zentrixa Admin</h1>
          <p className="mt-2 text-sm text-gray-400">Gestão de conteúdo e comunidade</p>

          <nav className="mt-8 space-y-3">
            {([
              ['posts', 'Posts'],
              ['comments', 'Comentários'],
              ['newsletter', 'Newsletter'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`block w-full rounded-lg px-4 py-3 text-left transition ${
                  activeTab === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="border-b border-gray-800 bg-gray-950 px-6 py-4 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold">Dashboard</h2>
                <p className="mt-1 text-sm text-gray-400">{loading ? 'A carregar dados...' : 'Painel administrativo funcional'}</p>
              </div>
              <button
                onClick={logout}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="space-y-8 px-6 py-8 lg:px-8">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: 'Posts', value: posts.length },
                { label: 'Comentários pendentes', value: comments.filter((comment) => !comment.approved).length },
                { label: 'Newsletter', value: subscribers.length },
                { label: 'Categorias', value: categories.length },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                  <p className="text-sm text-gray-400">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {error && <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</div>}
            {success && <div className="rounded-xl border border-green-500/30 bg-green-950/30 px-4 py-3 text-sm text-green-200">{success}</div>}

            {loading ? (
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-gray-400">A carregar conteúdo do dashboard...</div>
            ) : (
              <div className="space-y-8">
                {activeTab === 'posts' && (
                  <section className="space-y-6">
                    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold">{editingPostId ? 'Editar post' : 'Novo post'}</h3>
                          <p className="text-sm text-gray-400">Crie, edite e elimine posts da base de dados.</p>
                        </div>
                        {editingPostId && (
                          <button
                            onClick={resetPostForm}
                            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-800"
                          >
                            Cancelar edição
                          </button>
                        )}
                      </div>

                      <form onSubmit={savePost} className="grid gap-4 md:grid-cols-2">
                        <input
                          value={postForm.title}
                          onChange={(event) => setPostForm((current) => ({ ...current, title: event.target.value }))}
                          placeholder="Título"
                          className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500"
                          required
                        />
                        <input
                          value={postForm.slug}
                          onChange={(event) => setPostForm((current) => ({ ...current, slug: event.target.value }))}
                          placeholder="Slug"
                          className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500"
                          required
                        />
                        <input
                          value={postForm.author}
                          onChange={(event) => setPostForm((current) => ({ ...current, author: event.target.value }))}
                          placeholder="Autor"
                          className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500"
                        />
                        <select
                          value={postForm.category_id}
                          onChange={(event) => setPostForm((current) => ({ ...current, category_id: event.target.value }))}
                          className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white"
                        >
                          <option value="">Sem categoria</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <input
                          value={postForm.image}
                          onChange={(event) => setPostForm((current) => ({ ...current, image: event.target.value }))}
                          placeholder="URL da imagem"
                          className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 md:col-span-2"
                        />
                        <textarea
                          value={postForm.excerpt}
                          onChange={(event) => setPostForm((current) => ({ ...current, excerpt: event.target.value }))}
                          placeholder="Resumo"
                          rows={3}
                          className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 md:col-span-2"
                          required
                        />
                        <textarea
                          value={postForm.content}
                          onChange={(event) => setPostForm((current) => ({ ...current, content: event.target.value }))}
                          placeholder="Conteúdo"
                          rows={8}
                          className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 md:col-span-2"
                          required
                        />
                        <label className="flex items-center gap-3 text-sm text-gray-200">
                          <input
                            type="checkbox"
                            checked={postForm.published}
                            onChange={(event) => setPostForm((current) => ({ ...current, published: event.target.checked }))}
                            className="h-4 w-4 rounded border-gray-700 bg-gray-950"
                          />
                          Publicado
                        </label>
                        <div className="md:col-span-2 flex gap-3">
                          <button
                            type="submit"
                            disabled={actionLoading}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoading ? 'Guardando...' : editingPostId ? 'Atualizar post' : 'Criar post'}
                          </button>
                        </div>
                      </form>
                    </div>

                    <AdminTable
                      rows={posts}
                      emptyState="Nenhum post encontrado."
                      columns={[
                        {
                          header: 'Título',
                          render: (row: AdminPost) => (
                            <div>
                              <p className="font-medium text-white">{row.title}</p>
                              <p className="text-xs text-gray-400">{row.slug}</p>
                            </div>
                          ),
                        },
                        {
                          header: 'Categoria',
                          render: (row: AdminPost) => (
                            <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200">
                              {row.category_name || categoryNameById.get(row.category_id || '') || row.category || 'Sem categoria'}
                            </span>
                          ),
                        },
                        {
                          header: 'Estado',
                          render: (row: AdminPost) => (
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${row.published ? 'bg-green-900/50 text-green-200' : 'bg-yellow-900/50 text-yellow-200'}`}>
                              {row.published ? 'Publicado' : 'Rascunho'}
                            </span>
                          ),
                        },
                        {
                          header: 'Criado em',
                          render: (row: AdminPost) => <span>{formatDate(row.created_at)}</span>,
                        },
                        {
                          header: 'Ações',
                          render: (row: AdminPost) => (
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => handleEditPost(row)} className="rounded-lg border border-gray-700 px-3 py-1 text-xs text-white transition hover:bg-gray-800">
                                Editar
                              </button>
                              <button onClick={() => deletePost(row.id)} className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-200 transition hover:bg-red-950/40">
                                Eliminar
                              </button>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </section>
                )}

                {activeTab === 'comments' && (
                  <section className="space-y-6">
                    <AdminTable
                      rows={comments}
                      emptyState="Nenhum comentário encontrado."
                      columns={[
                        { header: 'Nome', render: (row: AdminComment) => <span className="font-medium text-white">{row.name}</span> },
                        { header: 'Email', render: (row: AdminComment) => <span className="text-gray-300">{row.email}</span> },
                        { header: 'Comentário', render: (row: AdminComment) => <p className="max-w-xl text-gray-300">{row.content}</p> },
                        { header: 'Estado', render: (row: AdminComment) => <span className={row.approved ? 'text-green-300' : 'text-yellow-300'}>{row.approved ? 'Aprovado' : 'Pendente'}</span> },
                        { header: 'Data', render: (row: AdminComment) => <span>{formatDate(row.created_at)}</span> },
                        {
                          header: 'Ações',
                          render: (row: AdminComment) => (
                            <div className="flex flex-wrap gap-2">
                              {!row.approved && (
                                <button onClick={() => approveComment(row.id)} className="rounded-lg bg-blue-600 px-3 py-1 text-xs text-white transition hover:bg-blue-700">
                                  Aprovar
                                </button>
                              )}
                              <button onClick={() => deleteComment(row.id)} className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-200 transition hover:bg-red-950/40">
                                Eliminar
                              </button>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </section>
                )}

                {activeTab === 'newsletter' && (
                  <section className="space-y-6">
                    <AdminTable
                      rows={subscribers}
                      emptyState="Nenhum subscritor encontrado."
                      columns={[
                        { header: 'Email', render: (row: NewsletterSubscriber) => <span className="font-medium text-white">{row.email}</span> },
                        { header: 'Inscrito em', render: (row: NewsletterSubscriber) => <span>{formatDate(row.created_at)}</span> },
                        {
                          header: 'Ações',
                          render: (row: NewsletterSubscriber) => (
                            <button onClick={() => deleteSubscriber(row.id)} className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-200 transition hover:bg-red-950/40">
                              Eliminar
                            </button>
                          ),
                        },
                      ]}
                    />
                  </section>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
