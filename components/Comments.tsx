'use client';

import { useEffect, useState } from 'react';
import { formatRelativeDate } from '@/lib/utils';

type Comment = {
  id: string;
  author_name?: string;
  name?: string;
  content: string;
  created_at: string;
};

type CommentsProps = {
  postSlug: string;
};

function getAvatarColor(name: string): string {
  const colors = [
    'bg-purple-600',
    'bg-blue-600',
    'bg-indigo-600',
    'bg-violet-600',
    'bg-cyan-600',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function Avatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  const bgColor = getAvatarColor(name);
  return (
    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${bgColor} text-sm font-bold text-white`}>
      {initial}
    </div>
  );
}

export function Comments({ postSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?post_slug=${encodeURIComponent(postSlug)}`);
        if (!response.ok) throw new Error('Erro ao buscar comentários');
        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setComments([]);
      }
    };

    fetchComments();
  }, [postSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_slug: postSlug,
          author_name: authorName.trim(),
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao enviar comentário');
        return;
      }

      setMessage(data.message || 'Comentário enviado para aprovação!');
      setAuthorName('');
      setContent('');
      setIsFocused(false);
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Erro ao enviar comentário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setIsFocused(false);
    setMessage(null);
    setError(null);
  };

  const getDisplayName = (comment: Comment): string => {
    return comment.name || comment.author_name || 'Anónimo';
  };

  return (
    <section className="border-t border-gray-800 bg-gray-950 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-gray-100">Comentários</h2>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="space-y-4">
            {/* Author Name Input */}
            <input
              type="text"
              placeholder="Seu nome"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-transparent text-gray-300 placeholder-gray-600 outline-none text-sm"
              disabled={isLoading}
            />

            {/* Content Input */}
            <div
              className={`border-b border-gray-700 transition-colors ${
                isFocused ? 'border-blue-500' : 'border-gray-700'
              }`}
            >
              <textarea
                placeholder="Adicione um comentário público..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => !content.trim() && setIsFocused(false)}
                className="w-full resize-none bg-transparent py-4 text-gray-300 placeholder-gray-600 outline-none text-sm"
                rows={isFocused ? 3 : 1}
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons */}
            {isFocused && (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !authorName.trim() || !content.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            )}

            {/* Messages */}
            {message && <p className="text-sm text-green-500">{message}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Ainda não há comentários publicados. Seja o primeiro a comentar!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar name={getDisplayName(comment)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-200 text-sm">
                      {getDisplayName(comment)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatRelativeDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1 break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
