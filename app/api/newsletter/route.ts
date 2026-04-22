import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/lib/db';

type NewsletterResponse = {
  message?: string;
  error?: string;
};

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Newsletter API misconfiguration: missing Supabase environment variables.');

    const response: NewsletterResponse = {
      error: 'Não foi possível concluir sua inscrição agora. Tente novamente em instantes.',
    };

    return NextResponse.json(response, { status: 500 });
  }

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
      console.error('Newsletter subscribe database error:', {
        email,
        errorMessage: result.errorMessage,
      });

      const response: NewsletterResponse = {
        error: 'Não foi possível concluir sua inscrição agora. Tente novamente em instantes.',
      };

      return NextResponse.json(response, { status: 500 });
    }

    const response: NewsletterResponse = {
      message: 'Email adicionado com sucesso!',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Newsletter subscribe unexpected error:', error);

    const response: NewsletterResponse = {
      error: 'Não foi possível concluir sua inscrição agora. Tente novamente em instantes.',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
