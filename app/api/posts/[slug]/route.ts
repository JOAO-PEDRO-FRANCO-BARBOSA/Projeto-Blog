import { NextRequest, NextResponse } from 'next/server';

// Mock para buscar post por slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Mock data
    const mockPosts: Record<string, any> = {
      'vs-code-15-extensoes-essenciais': {
        id: '1',
        title: 'VS Code: 15 Extensões Essenciais para Programadores Iniciantes',
        slug: 'vs-code-15-extensoes-essenciais',
        content: 'Conteúdo do artigo...',
        author: 'Zentrix',
      },
    };

    const post = mockPosts[slug];

    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar post' },
      { status: 500 }
    );
  }
}
