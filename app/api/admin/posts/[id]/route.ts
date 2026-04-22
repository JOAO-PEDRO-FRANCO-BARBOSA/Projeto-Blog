import { NextRequest, NextResponse } from 'next/server';
import { getAdminClientOrUnauthorized } from '../../_utils';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updates = {
      title: body?.title,
      slug: body?.slug,
      excerpt: body?.excerpt,
      content: body?.content,
      image: body?.image || null,
      author: body?.author,
      category_id: body?.category_id || null,
      category: body?.category || null,
      published: Boolean(body?.published),
      keywords: Array.isArray(body?.keywords) ? body.keywords : null,
      read_time: body?.read_time ? Number(body.read_time) : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await auth.client
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar post.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const { error } = await auth.client.from('posts').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post removido.' });
  } catch {
    return NextResponse.json({ error: 'Erro ao eliminar post.' }, { status: 500 });
  }
}
