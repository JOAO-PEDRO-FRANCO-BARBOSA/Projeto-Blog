import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/db';

type NewsletterResponse = {
  message?: string;
  error?: string;
};

type BrevoErrorResponse = {
  code?: string;
  message?: string;
};

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoListId = Number.parseInt(process.env.BREVO_LIST_ID ?? '', 10);

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
    const { error } = await supabaseClient
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Newsletter subscribe database error:', error);

      const response: NewsletterResponse = {
        error: 'Não foi possível concluir sua inscrição agora. Tente novamente em instantes.',
      };

      return NextResponse.json(response, { status: 500 });
    }

    if (brevoApiKey && Number.isInteger(brevoListId) && brevoListId > 0) {
      try {
        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            listIds: [brevoListId],
          }),
        });

        if (!brevoResponse.ok) {
          let brevoErrorBody: BrevoErrorResponse | null = null;

          try {
            brevoErrorBody = (await brevoResponse.json()) as BrevoErrorResponse;
          } catch {
            brevoErrorBody = null;
          }

          const brevoErrorText = `${brevoErrorBody?.code ?? ''} ${brevoErrorBody?.message ?? ''}`.toLowerCase();
          const isContactAlreadyExists =
            brevoResponse.status === 400 &&
            /already exist|already exists|duplicate/.test(brevoErrorText);

          if (!isContactAlreadyExists) {
            console.error('Newsletter subscribe Brevo API error:', {
              status: brevoResponse.status,
              body: brevoErrorBody,
            });
          }
        }
      } catch (brevoError) {
        console.error('Newsletter subscribe Brevo integration unexpected error:', brevoError);
      }
    } else {
      console.error('Newsletter Brevo integration misconfiguration: missing BREVO_API_KEY or invalid BREVO_LIST_ID.');
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
