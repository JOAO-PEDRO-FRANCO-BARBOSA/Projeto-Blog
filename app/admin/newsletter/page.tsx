'use client';

import { useEffect, useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { formatDate } from '@/lib/utils';

interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadSubscribers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/newsletter');
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao carregar newsletter.');
      }

      setSubscribers(Array.isArray(payload) ? payload : []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar newsletter.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSubscribers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const deleteSubscriber = async (id: string) => {
    if (!window.confirm('Eliminar este subscritor?')) {
      return;
    }

    setActionLoadingId(id);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, { method: 'DELETE' });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao eliminar subscritor.');
      }

      setSubscribers((current) => current.filter((subscriber) => subscriber.id !== id));
      setMessage('Subscritor eliminado com sucesso.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao eliminar subscritor.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 lg:px-8">
      <header className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h1 className="text-2xl font-bold text-white">Gestão de Newsletter</h1>
        <p className="mt-2 text-sm text-gray-400">Acompanhe e gerencie os subscritores do blog.</p>
      </header>

      {error && <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</p>}
      {message && <p className="rounded-lg border border-green-500/40 bg-green-950/40 px-4 py-3 text-sm text-green-200">{message}</p>}

      {loading ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-sm text-gray-400">A carregar subscritores...</div>
      ) : (
        <AdminTable
          rows={subscribers}
          emptyState="Nenhum subscritor encontrado."
          columns={[
            {
              header: 'Email',
              render: (row: NewsletterSubscriber) => <span className="font-medium text-white">{row.email}</span>,
            },
            {
              header: 'Inscrito em',
              render: (row: NewsletterSubscriber) => <span>{formatDate(row.created_at)}</span>,
            },
            {
              header: 'Ações',
              render: (row: NewsletterSubscriber) => (
                <button
                  onClick={() => deleteSubscriber(row.id)}
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
