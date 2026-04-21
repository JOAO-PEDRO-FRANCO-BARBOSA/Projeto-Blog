import { NextRequest, NextResponse } from 'next/server';

// Mock para listar posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') || '12';
    const offset = searchParams.get('offset') || '0';

    // Mock data - depois substituir por Supabase
    const mockPosts = [
      {
        id: '1',
        title: 'VS Code: 15 Extensões Essenciais para Programadores Iniciantes',
        slug: 'vs-code-15-extensoes-essenciais',
        excerpt: 'Descubra as 15 extensões mais úteis do VS Code...',
        category: 'Programação',
        author: 'Zentrix',
        image: '/images/article-1.jpg',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: '10 Ferramentas de IA Gratuitas para Aumentar sua Produtividade em 2025',
        slug: '10-ferramentas-ia-gratuitas-2025',
        excerpt: 'Explore 10 ferramentas de IA que você pode usar gratuitamente...',
        category: 'Inteligência Artificial',
        author: 'Zentrix',
        image: '/images/article-2.jpg',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    const filtered = category
      ? mockPosts.filter((p) => p.category === category)
      : mockPosts;

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar posts' },
      { status: 500 }
    );
  }
}
