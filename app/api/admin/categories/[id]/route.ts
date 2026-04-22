import { NextRequest, NextResponse } from 'next/server';
import { getAdminClientOrUnauthorized } from '../../_utils';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const { id } = await params;

    const linkedPosts = await auth.client
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id);

    if (linkedPosts.error) {
      return NextResponse.json({ error: linkedPosts.error.message }, { status: 500 });
    }

    if ((linkedPosts.count || 0) > 0) {
      return NextResponse.json(
        { error: 'Não é possível eliminar esta categoria porque existem posts ligados a ela.' },
        { status: 409 }
      );
    }

    const { error } = await auth.client.from('categories').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Categoria eliminada com sucesso.' });
  } catch {
    return NextResponse.json({ error: 'Erro ao eliminar categoria.' }, { status: 500 });
  }
}
