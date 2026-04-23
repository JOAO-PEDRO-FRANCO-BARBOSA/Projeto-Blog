import { NextRequest, NextResponse } from 'next/server';
import { createCommentBySlug, getApprovedCommentsBySlug } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postSlug = String(searchParams.get('post_slug') || '').trim();

    if (!postSlug) {
      return NextResponse.json(
        { error: 'post_slug é obrigatório' },
        { status: 400 }
      );
    }

    const result = await getApprovedCommentsBySlug(postSlug);
    if (result.errorMessage) {
      console.error('Database error fetching comments:', result.errorMessage);
      return NextResponse.json(
        { error: 'Erro ao buscar comentários. Tente novamente mais tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/comments:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar comentários. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const postSlug = String(body?.post_slug || '').trim();
    const authorName = String(body?.author_name || '').trim();
    const content = String(body?.content || '').trim();

    if (!postSlug || !authorName || !content) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const result = await createCommentBySlug({
      post_slug: postSlug,
      author_name: authorName,
      content,
    });

    if (result.errorMessage) {
      console.error('Database error creating comment:', result.errorMessage);
      return NextResponse.json(
        { error: 'Erro ao enviar comentário. Tente novamente mais tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Comentário enviado! Será revisado antes de publicar.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/comments:', error);
    return NextResponse.json(
      { error: 'Erro ao processar comentário. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
