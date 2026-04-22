import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    void request;
    const { slug } = await params;

    const result = await getPostBySlug(slug);
    const post = result.data;

    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar post' },
      { status: 500 }
    );
  }
}
