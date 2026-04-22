import { NextRequest, NextResponse } from 'next/server';
import { getAdminClientOrUnauthorized } from '../../_utils';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const approved = Boolean(body?.approved ?? true);

    const { data, error } = await auth.client
      .from('comments')
      .update({ approved, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar comentário.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const { error } = await auth.client.from('comments').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Comentário eliminado.' });
  } catch {
    return NextResponse.json({ error: 'Erro ao eliminar comentário.' }, { status: 500 });
  }
}
