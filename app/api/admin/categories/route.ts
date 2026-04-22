import { NextRequest, NextResponse } from 'next/server';
import { getAdminClientOrUnauthorized } from '../_utils';

type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

function createSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET(request: NextRequest) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { data, error } = await auth.client
    .from('categories')
    .select('id, name, slug, created_at')
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data || []) as Category[]);
}

export async function POST(request: NextRequest) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const name = String(body?.name || '').trim();

    if (!name) {
      return NextResponse.json({ error: 'O nome da categoria é obrigatório.' }, { status: 400 });
    }

    const slug = createSlug(name);

    if (!slug) {
      return NextResponse.json({ error: 'Não foi possível gerar slug para esta categoria.' }, { status: 400 });
    }

    const duplicate = await auth.client
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (duplicate.error) {
      return NextResponse.json({ error: duplicate.error.message }, { status: 500 });
    }

    if (duplicate.data) {
      return NextResponse.json({ error: 'Já existe uma categoria com este nome/slug.' }, { status: 409 });
    }

    const { data, error } = await auth.client
      .from('categories')
      .insert([
        {
          name,
          slug,
          created_at: new Date().toISOString(),
        },
      ])
      .select('id, name, slug, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro ao criar categoria.' }, { status: 500 });
  }
}
