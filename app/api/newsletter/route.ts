import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/lib/db';

type NewsletterResponse = {
  message?: string;
  error?: string;
};

export async function POST(request: NextRequest) {
  let body: unknown;

  // Structural fix: invalid or empty JSON now returns 400 before reading fields.
  try {
    body = await request.json();
  } catch {
    const response: NewsletterResponse = {
      error: 'JSON inválido no corpo da requisição.',
    };

    return NextResponse.json(response, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    const response: NewsletterResponse = {
      error: 'Corpo da requisição inválido.',
    };

    return NextResponse.json(response, { status: 400 });
  }

  const emailValue = 'email' in body ? (body as { email?: unknown }).email : '';
  const email = String(emailValue ?? '').trim().toLowerCase();

  if (!email || !email.includes('@') || email.length < 5) {
    const response: NewsletterResponse = {
      error: 'Email inválido',
    };

    return NextResponse.json(response, { status: 400 });
  }

  try {
    const result = await subscribeNewsletter(email);

    if (result.errorMessage) {
      const response: NewsletterResponse = {
        error: result.errorMessage,
      };

      return NextResponse.json(response, { status: 500 });
    }

    const response: NewsletterResponse = {
      message: 'Email adicionado com sucesso!',
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    const response: NewsletterResponse = {
      error: 'Erro ao processar requisição',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
