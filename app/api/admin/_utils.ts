import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientWithToken } from '@/lib/db';
import { getAdminUserFromRequest } from '@/lib/admin-auth';

export async function getAdminClientOrUnauthorized(request: NextRequest) {
  const authResult = await getAdminUserFromRequest(request);

  if (!authResult.user || !authResult.accessToken) {
    if (authResult.status === 'auth_failed') {
      return {
        error: NextResponse.json({ error: 'auth_failed' }, { status: 401 }),
      };
    }

    return {
      error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    };
  }

  return {
    client: createSupabaseClientWithToken(authResult.accessToken),
    user: authResult.user,
  };
}
