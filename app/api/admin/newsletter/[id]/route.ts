import { NextRequest, NextResponse } from 'next/server';
import { getAdminClientOrUnauthorized } from '../../_utils';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const { error } = await auth.client.from('newsletter_subscribers').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscriber removido.' });
  } catch {
    return NextResponse.json({ error: 'Erro ao eliminar subscriber.' }, { status: 500 });
  }
}
