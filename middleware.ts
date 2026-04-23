import { NextRequest, NextResponse } from 'next/server';
import { getAdminUserFromRequest } from '@/lib/admin-auth';

const PUBLIC_ADMIN_API_PATHS = ['/api/admin/login', '/api/admin/logout'];

function buildLoginUrl(request: NextRequest, includeError = false) {
  const loginUrl = new URL('/login', request.url);
  if (includeError) {
    loginUrl.searchParams.set('error', 'auth_failed');
  }
  return loginUrl;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isLoginPage = pathname === '/login';
  const isLegacyAdminLogin = pathname === '/admin/login';

  if (!isAdminPage && !isAdminApi && !isLoginPage) {
    return NextResponse.next();
  }

  if (isLegacyAdminLogin) {
    return NextResponse.redirect(buildLoginUrl(request));
  }

  if (PUBLIC_ADMIN_API_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const authResult = await getAdminUserFromRequest(request, response);
  const isAuthenticated = Boolean(authResult.user);

  if (authResult.status === 'auth_failed') {
    if (isAdminApi) {
      return NextResponse.json({ error: 'auth_failed' }, { status: 401 });
    }

    if (isLoginPage && request.nextUrl.searchParams.get('error') === 'auth_failed') {
      return NextResponse.next();
    }

    return NextResponse.redirect(buildLoginUrl(request, true));
  }

  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (isAuthenticated) {
    return response;
  }

  if (isAdminApi) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  return NextResponse.redirect(buildLoginUrl(request));
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/login'],
};
