import { NextRequest, NextResponse } from 'next/server';

// Mock para comentários
export async function POST(request: NextRequest) {
  try {
    const { postId, name, email, content } = await request.json();

    if (!name || !email || !content) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Aqui você integraria com Supabase
    console.log('New comment:', { postId, name, email, content });

    return NextResponse.json(
      { message: 'Comentário enviado! Será revisado antes de publicar.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
