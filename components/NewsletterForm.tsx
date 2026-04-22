'use client';

import { useState } from 'react';

type NewsletterResponse = {
  message?: string;
  error?: string;
};

type Feedback = {
  type: 'success' | 'error';
  text: string;
};

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const parseResponseSafely = async (response: Response): Promise<NewsletterResponse> => {
    // Structural fix: handle empty/non-JSON responses without throwing in the UI.
    const rawText = await response.text();

    if (!rawText) {
      return {};
    }

    try {
      return JSON.parse(rawText) as NewsletterResponse;
    } catch {
      return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const payload = await parseResponseSafely(response);

      if (response.ok) {
        setFeedback({
          type: 'success',
          text: payload.message || 'Email adicionado com sucesso!',
        });
        setEmail('');
      } else {
        setFeedback({
          type: 'error',
          text: payload.error || `Erro ao adicionar email (status ${response.status}).`,
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        text: 'Falha de rede. Verifique sua conexão e tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (feedback) {
              setFeedback(null);
            }
          }}
          required
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
        >
          {loading ? 'Enviando...' : 'Inscrever'}
        </button>
      </div>
      {feedback && (
        <p className={`text-sm ${feedback.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {feedback.text}
        </p>
      )}
    </form>
  );
}
