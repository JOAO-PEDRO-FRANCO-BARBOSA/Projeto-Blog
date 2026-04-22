import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();

    if (!email || !email.includes('@') || email.length < 5) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const result = await subscribeNewsletter(email);

    if (result.errorMessage) {
      return NextResponse.json(
        { error: result.errorMessage },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email adicionado com sucesso!' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
