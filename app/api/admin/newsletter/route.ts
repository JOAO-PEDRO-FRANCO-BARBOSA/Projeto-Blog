import { NextRequest, NextResponse } from 'next/server';
import { getAdminClientOrUnauthorized } from '../_utils';

export async function GET(request: NextRequest) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { data, error } = await auth.client
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
