'use client';

import { useEffect, useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('Erro ao carregar categorias');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        loadCategories();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar categoria');
      }

      setSuccess('Categoria criada com sucesso');
      setNewCategoryName('');
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem a certeza que pretende eliminar esta categoria?')) return;

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao eliminar categoria');
      }

      setSuccess('Categoria eliminada com sucesso');
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao eliminar categoria');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Gerir Categorias</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Create Category Form */}
          <form onSubmit={handleCreateCategory} className="space-y-3">
            <label className="block text-sm font-medium text-gray-200">
              Nova categoria
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nome da categoria"
                className="flex-1 px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-600 transition"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newCategoryName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <Plus size={16} />
                Criar
              </button>
            </div>
          </form>

          {/* Alerts */}
          {error && (
            <div className="px-4 py-3 bg-red-950/50 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 bg-green-950/50 border border-green-500/30 rounded-lg text-green-200 text-sm">
              {success}
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Categorias
            </label>

            {loading ? (
              <div className="text-gray-400 text-sm text-center py-4">
                A carregar categorias...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-4">
                Nenhuma categoria encontrada
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-950/50 border border-gray-800 rounded-lg hover:border-gray-700 transition"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.slug}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-400 hover:text-red-300 transition p-2"
                      aria-label={`Eliminar ${category.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
