'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { formatDate } from '@/lib/utils';

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
}

interface AdminPost {
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
}

interface PostFormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  category_id: string;
  published: boolean;
}

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

export default function AdminPostsPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<PostFormState>(defaultPostForm);

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoriesResponse, postsResponse] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/posts'),
      ]);

      const [categoriesPayload, postsPayload] = await Promise.all([
        categoriesResponse.json(),
        postsResponse.json(),
      ]);

      if (!categoriesResponse.ok) {
        throw new Error(categoriesPayload?.error || 'Erro ao carregar categorias.');
      }

      if (!postsResponse.ok) {
        throw new Error(postsPayload?.error || 'Erro ao carregar posts.');
      }

      setCategories(Array.isArray(categoriesPayload) ? categoriesPayload : []);
      setPosts(Array.isArray(postsPayload) ? postsPayload : []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const resetPostForm = () => {
    setPostForm(defaultPostForm);
    setEditingPostId(null);
  };

  const handleEditPost = (post: AdminPost) => {
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

      setSuccess(editingPostId ? 'Post atualizado com sucesso.' : 'Post criado com sucesso.');
      resetPostForm();
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao salvar post.');
    } finally {
      setActionLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Eliminar este post?')) {
      return;
    }

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
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao eliminar post.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 lg:px-8">
      <header className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h1 className="text-2xl font-bold text-white">Gestão de Posts</h1>
        <p className="mt-2 text-sm text-gray-400">Crie, edite e elimine posts do blog.</p>
      </header>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</div>}
      {success && <div className="rounded-xl border border-green-500/30 bg-green-950/30 px-4 py-3 text-sm text-green-200">{success}</div>}

      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{editingPostId ? 'Editar post' : 'Novo post'}</h2>
            <p className="text-sm text-gray-400">Preencha os campos abaixo para guardar o conteúdo.</p>
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
          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading ? 'A guardar...' : editingPostId ? 'Atualizar post' : 'Criar post'}
            </button>
          </div>
        </form>
      </section>

      {loading ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-sm text-gray-400">A carregar posts...</div>
      ) : (
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
                  <button
                    onClick={() => handleEditPost(row)}
                    className="rounded-lg border border-gray-700 px-3 py-1 text-xs text-white transition hover:bg-gray-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deletePost(row.id)}
                    className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-200 transition hover:bg-red-950/40"
                  >
                    Eliminar
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
