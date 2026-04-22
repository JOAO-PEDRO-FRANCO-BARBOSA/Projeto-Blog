import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientWithToken } from '@/lib/db';
import { getAdminUserFromRequest } from '@/lib/admin-auth';

export async function getAdminClientOrUnauthorized(request: NextRequest) {
  const authResult = await getAdminUserFromRequest(request);

  if (!authResult.user || !authResult.accessToken) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return {
    client: createSupabaseClientWithToken(authResult.accessToken),
    user: authResult.user,
  };
}
