'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/categories');
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao carregar categorias.');
      }

      setCategories(Array.isArray(payload) ? payload : []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCategories();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('O nome da categoria é obrigatório.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao criar categoria.');
      }

      setName('');
      setSuccess('Categoria criada com sucesso.');
      await loadCategories();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao criar categoria.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja eliminar esta categoria?')) {
      return;
    }

    setError(null);
    setSuccess(null);
    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao eliminar categoria.');
      }

      setSuccess('Categoria eliminada com sucesso.');
      await loadCategories();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível eliminar a categoria. Verifique se há posts ligados.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-8 text-white lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerir Categorias</h1>
            <p className="mt-1 text-sm text-gray-400">Crie e elimine categorias do blog.</p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
          >
            Voltar ao Dashboard
          </Link>
        </div>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</div>}
        {success && <div className="rounded-xl border border-green-500/30 bg-green-950/30 px-4 py-3 text-sm text-green-200">{success}</div>}

        <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Nova Categoria</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(null);
                if (success) setSuccess(null);
              }}
              placeholder="Nome da categoria"
              className="flex-1 rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'A guardar...' : 'Adicionar'}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Categorias Existentes</h2>

          {loading ? (
            <p className="text-gray-400">A carregar categorias...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-400">Nenhuma categoria encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800 text-left text-sm">
                <thead className="bg-gray-950">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-300">Nome</th>
                    <th className="px-4 py-3 font-medium text-gray-300">Slug</th>
                    <th className="px-4 py-3 font-medium text-gray-300">Criada em</th>
                    <th className="px-4 py-3 font-medium text-gray-300">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-4 py-3 font-medium text-white">{category.name}</td>
                      <td className="px-4 py-3 text-gray-300">{category.slug}</td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(category.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={deletingId === category.id}
                          aria-label={`Eliminar categoria ${category.name}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-200 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 size={14} />
                          {deletingId === category.id ? 'A eliminar...' : 'Eliminar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
