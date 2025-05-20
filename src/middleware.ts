import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isLoginPage = req.nextUrl.pathname === '/auth/login';

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', req.nextUrl.pathname);

  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ Ruta protegida:', req.nextUrl.pathname);
    console.log('🧾 Token:', token);
  }

  if (isDashboard && !isAuth) {
    const loginUrl = new URL('/auth/log', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirigir si ya está autenticado e intenta ir al login
  if (isLoginPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login'],
};
