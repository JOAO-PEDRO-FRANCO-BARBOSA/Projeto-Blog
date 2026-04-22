import { NextRequest, NextResponse } from 'next/server';
import { searchPosts } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const result = await searchPosts(q);
  if (result.errorMessage) {
    return NextResponse.json({ error: result.errorMessage }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
