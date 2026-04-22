import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = Number(searchParams.get('limit') || '12');
    const offset = Number(searchParams.get('offset') || '0');

    const result = await getPosts(limit, offset, category || undefined);
    if (result.errorMessage) {
      return NextResponse.json({ error: result.errorMessage }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar posts' },
      { status: 500 }
    );
  }
}
