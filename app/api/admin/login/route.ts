import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { applyAdminSessionCookies } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '').trim();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios.' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: error?.message || 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ message: 'Autenticado com sucesso.' }, { status: 200 });
    applyAdminSessionCookies(response, data.session);
    return response;
  } catch {
    return NextResponse.json({ error: 'Erro ao autenticar.' }, { status: 500 });
  }
}
