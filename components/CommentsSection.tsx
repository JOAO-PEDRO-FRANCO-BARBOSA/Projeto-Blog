'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Comment, supabaseClient } from '@/lib/db';
import { formatRelativeTime } from '@/lib/relative-time';

type CommentsSectionProps = {
  postId: string;
  initialComments: Comment[];
};

type CommentNode = Comment & {
  replies: CommentNode[];
};

function buildCommentTree(comments: Comment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  map.forEach((comment) => {
    if (comment.parent_id && map.has(comment.parent_id)) {
      map.get(comment.parent_id)?.replies.push(comment);
      return;
    }

    roots.push(comment);
  });

  const sortReplies = (nodes: CommentNode[]) => {
    nodes.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    nodes.forEach((node) => sortReplies(node.replies));
  };

  roots.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  roots.forEach((node) => sortReplies(node.replies));

  return roots;
}

function getInitialFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
}

export function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  useEffect(() => {
    let cancelled = false;

    const loadComments = async () => {
      setLoadingComments(true);
      setError(null);

      try {
        const { data, error: loadError } = await supabaseClient
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .eq('approved', true)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (loadError) {
          throw loadError;
        }

        if (!cancelled) {
          setComments((data || []) as Comment[]);
        }
      } catch (requestError) {
        console.error('Comment fetch failed:', requestError);
        if (!cancelled) {
          setError('Falha ao carregar comentários.');
        }
      } finally {
        if (!cancelled) {
          setLoadingComments(false);
        }
      }
    };

    void loadComments();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const submitComment = async (payload: {
    name: string;
    email: string;
    content: string;
    parentId: string | null;
  }) => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { data, error: insertError } = await supabaseClient
        .from('comments')
        .insert([
          {
            post_id: postId,
            parent_id: payload.parentId,
            name: payload.name.trim(),
            email: payload.email.trim().toLowerCase(),
            content: payload.content.trim(),
            approved: true,
            is_approved: true,
          },
        ])
        .select('*')
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        setComments((current) => [data as Comment, ...current]);
      }

      setMessage(payload.parentId ? 'Resposta publicada com sucesso.' : 'Comentário publicado com sucesso.');
      return true;
    } catch (requestError) {
      console.error('Comment submit failed:', requestError);
      setError('Falha de conexão ao enviar comentário.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const created = await submitComment({
      name,
      email,
      content,
      parentId: null,
    });

    if (created) {
      setName('');
      setEmail('');
      setContent('');
    }
  };

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!replyTo) {
      return;
    }

    const created = await submitComment({
      name: replyName,
      email: replyEmail,
      content: replyContent,
      parentId: replyTo,
    });

    if (created) {
      setReplyTo(null);
      setReplyName('');
      setReplyEmail('');
      setReplyContent('');
    }
  };

  const renderComment = (comment: CommentNode, depth = 0): JSX.Element => {
    const hasReplies = comment.replies.length > 0;
    const isReply = depth > 0;

    return (
      <article
        key={comment.id}
        className={`rounded-xl border border-gray-800 bg-gray-900 p-4 ${isReply ? 'ml-8 border-l-2 border-l-blue-500/50' : ''}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {getInitialFromName(comment.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-slate-100">{comment.name}</strong>
              <span className="text-xs text-gray-400">{formatRelativeTime(comment.created_at)}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-gray-200">{comment.content}</p>
            <button
              type="button"
              onClick={() => setReplyTo((current) => (current === comment.id ? null : comment.id))}
              className="mt-3 text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              Responder
            </button>

            {replyTo === comment.id && (
              <form onSubmit={handleReplySubmit} className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-950 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={replyName}
                    onChange={(event) => setReplyName(event.target.value)}
                    required
                    className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={replyEmail}
                    onChange={(event) => setReplyEmail(event.target.value)}
                    required
                    className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <textarea
                  rows={3}
                  placeholder="Escreva sua resposta"
                  value={replyContent}
                  onChange={(event) => setReplyContent(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'A publicar...' : 'Publicar resposta'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-900"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {hasReplies && <div className="mt-4 space-y-3">{comment.replies.map((reply) => renderComment(reply, depth + 1))}</div>}
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="border-t border-gray-800 bg-gray-950 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-slate-100">Comentários</h2>

        <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-950 p-6">
          {loadingComments ? (
            <p className="text-gray-400">A carregar comentários...</p>
          ) : commentTree.length === 0 ? (
            <p className="text-gray-400">Ainda não há comentários publicados.</p>
          ) : (
            commentTree.map((comment) => renderComment(comment))
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-100">Deixe um comentário</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2 text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2 text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            placeholder="Escreva seu comentário"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            rows={4}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2 text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'A publicar...' : 'Publicar comentário'}
          </button>

          {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </form>
      </div>
    </section>
  );
}
