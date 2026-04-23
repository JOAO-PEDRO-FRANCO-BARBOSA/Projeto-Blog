import { NextRequest, NextResponse } from 'next/server';
import { createComment, getApprovedComments } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = String(searchParams.get('postId') || '').trim();

    if (!postId) {
      return NextResponse.json(
        { error: 'postId é obrigatório' },
        { status: 400 }
      );
    }

    const result = await getApprovedComments(postId);
    if (result.errorMessage) {
      return NextResponse.json({ error: result.errorMessage }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar comentários' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const postId = String(body?.postId || '').trim();
    const parentId = String(body?.parentId || '').trim();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const content = String(body?.content || '').trim();

    if (!postId || !name || !email || !content) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const result = await createComment({
      post_id: postId,
      parent_id: parentId || null,
      name,
      email,
      content,
    });

    if (result.errorMessage) {
      return NextResponse.json(
        { error: result.errorMessage },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Comentário publicado com sucesso.' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
