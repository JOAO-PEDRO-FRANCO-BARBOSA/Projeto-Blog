import { NextRequest, NextResponse } from 'next/server';

// Mock de posts para busca
const mockPosts = [
  { id: '1', title: 'VS Code: 15 Extensões Essenciais para Programadores Iniciantes', slug: 'vs-code-15-extensoes-essenciais', excerpt: 'Descubra as 15 extensões mais úteis do VS Code...' },
  { id: '2', title: '10 Ferramentas de IA Gratuitas para Aumentar sua Produtividade em 2025', slug: '10-ferramentas-ia-gratuitas-2025', excerpt: 'Explore 10 ferramentas de IA que você pode usar gratuitamente...' },
  { id: '3', title: 'Como Ganhar Dinheiro com ChatGPT: 7 Métodos Comprovados em 2025', slug: 'ganhar-dinheiro-chatgpt-7-metodos', excerpt: 'Descubra 7 formas práticas e comprovadas de ganhar dinheiro...' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q')?.toLowerCase() || '';

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const results = mockPosts.filter((post) =>
    post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)
  );

  return NextResponse.json(results);
}
