import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/db';
import { getAdminClientOrUnauthorized } from '../_utils';

export async function GET(request: NextRequest) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  const [postsResponse, categoriesResponse] = await Promise.all([
    auth.client.from('posts').select('*').order('created_at', { ascending: false }),
    getCategories(),
  ]);

  if (postsResponse.error) {
    return NextResponse.json({ error: postsResponse.error.message }, { status: 500 });
  }

  const categoriesById = new Map(categoriesResponse.data.map((category) => [category.id, category.name]));
  const posts = (postsResponse.data || []).map((post) => ({
    ...post,
    category_name: post.category_id ? categoriesById.get(post.category_id) ?? null : post.category ?? null,
  }));

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const title = String(body?.title || '').trim();
    const slug = String(body?.slug || '').trim();
    const excerpt = String(body?.excerpt || '').trim();
    const content = String(body?.content || '').trim();
    const image = String(body?.image || '').trim() || null;
    const author = String(body?.author || 'Zentrixa').trim();
    const categoryId = String(body?.category_id || '').trim() || null;
    const category = String(body?.category || '').trim() || null;
    const published = Boolean(body?.published);
    const keywords = Array.isArray(body?.keywords) ? body.keywords : null;
    const readTime = body?.read_time ? Number(body.read_time) : null;

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 });
    }

    const { data, error } = await auth.client
      .from('posts')
      .insert([
        {
          title,
          slug,
          excerpt,
          content,
          image,
          author,
          category_id: categoryId,
          category,
          published,
          keywords,
          read_time: readTime,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro ao criar post.' }, { status: 500 });
  }
}
