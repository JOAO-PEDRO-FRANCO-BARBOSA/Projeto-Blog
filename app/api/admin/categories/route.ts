import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/db';
import { getAdminClientOrUnauthorized } from '../_utils';

export async function GET(request: NextRequest) {
  const auth = await getAdminClientOrUnauthorized(request);
  if ('error' in auth) {
    return auth.error;
  }

  const result = await getCategories();
  if (result.errorMessage) {
    return NextResponse.json({ error: result.errorMessage }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
