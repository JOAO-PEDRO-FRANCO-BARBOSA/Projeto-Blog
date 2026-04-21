import { NextRequest, NextResponse } from 'next/server';

// Mock para newsletter (depois integrar com Supabase/Brevo)
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Aqui você integraria com Supabase ou Brevo
    // Por enquanto, apenas retorna sucesso
    console.log('Newsletter signup:', email);

    return NextResponse.json(
      { message: 'Email adicionado com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
