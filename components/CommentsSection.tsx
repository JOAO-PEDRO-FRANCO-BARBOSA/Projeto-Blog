'use client';

import { FormEvent, useState } from 'react';
import { Comment } from '@/lib/db';
import { formatDate } from '@/lib/utils';

type CommentsSectionProps = {
  postId: string;
  initialComments: Comment[];
};

export function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const [comments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          name,
          email,
          content,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error || 'Erro ao enviar comentário.');
        return;
      }

      setMessage(payload?.message || 'Comentário enviado para aprovação.');
      setName('');
      setEmail('');
      setContent('');
    } catch (requestError) {
      console.error('Comment submit failed:', requestError);
      setError('Falha de conexão ao enviar comentário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-gray-200 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-slate-100">Comentários</h2>

        <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-950">
          {comments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">Ainda não há comentários publicados.</p>
          ) : (
            comments.map((comment) => (
              <article key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0 dark:border-gray-800">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <strong className="text-slate-900 dark:text-slate-100">{comment.name}</strong>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
              </article>
            ))
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-lg border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-950"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Deixe um comentário</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100 dark:placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100 dark:placeholder-gray-400"
            />
          </div>

          <textarea
            placeholder="Escreva seu comentário"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            rows={4}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100 dark:placeholder-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Enviando...' : 'Enviar comentário'}
          </button>

          {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </form>
      </div>
    </section>
  );
}
