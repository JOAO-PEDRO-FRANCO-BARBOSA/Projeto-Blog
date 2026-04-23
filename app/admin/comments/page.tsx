'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Comment } from '@/lib/db';
import { formatDate } from '@/lib/utils';

type AdminComment = Comment;

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const totalPending = useMemo(
    () => comments.filter((comment) => !comment.approved || !comment.is_approved).length,
    [comments]
  );

  const loadComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/comments');
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao carregar comentários.');
      }

      setComments((payload || []) as AdminComment[]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar comentários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadComments();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const deleteComment = async (id: string) => {
    if (!confirm('Eliminar este comentário?')) {
      return;
    }

    setActionLoadingId(id);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao eliminar comentário.');
      }

      setComments((current) => current.filter((comment) => comment.id !== id));
      setMessage('Comentário eliminado com sucesso.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao eliminar comentário.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 lg:px-8">
      <header className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h1 className="text-2xl font-bold text-white">Gestão de Comentários</h1>
        <p className="mt-2 text-sm text-gray-400">Gerencie todos os comentários publicados e remova conteúdo inadequado.</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-gray-800 px-3 py-1 text-gray-200">Total: {comments.length}</span>
          <span className="rounded-full bg-yellow-900/40 px-3 py-1 text-yellow-200">Pendentes: {totalPending}</span>
        </div>
      </header>

      {error && <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</p>}
      {message && <p className="rounded-lg border border-green-500/40 bg-green-950/40 px-4 py-3 text-sm text-green-200">{message}</p>}

      {loading ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-sm text-gray-400">A carregar comentários...</div>
      ) : (
        <AdminTable
          rows={comments}
          emptyState="Nenhum comentário encontrado."
          columns={[
            {
              header: 'Nome',
              render: (row: AdminComment) => <span className="font-medium text-white">{row.name}</span>,
            },
            {
              header: 'Email',
              render: (row: AdminComment) => <span className="text-gray-300">{row.email}</span>,
            },
            {
              header: 'Comentário',
              render: (row: AdminComment) => <p className="max-w-xl whitespace-pre-wrap text-gray-300">{row.content}</p>,
            },
            {
              header: 'Estado',
              render: (row: AdminComment) => (
                <span className={row.approved && row.is_approved ? 'text-green-300' : 'text-yellow-300'}>
                  {row.approved && row.is_approved ? 'Aprovado' : 'Pendente'}
                </span>
              ),
            },
            {
              header: 'Data',
              render: (row: AdminComment) => <span>{formatDate(row.created_at)}</span>,
            },
            {
              header: 'Ações',
              render: (row: AdminComment) => (
                <button
                  onClick={() => deleteComment(row.id)}
                  disabled={actionLoadingId === row.id}
                  className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-200 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoadingId === row.id ? 'A eliminar...' : 'Eliminar'}
                </button>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
