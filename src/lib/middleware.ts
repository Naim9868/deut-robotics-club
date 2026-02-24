import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/utils/auth';

// Paths that don't require authentication
const publicPaths = [
  '/admin/login',
  '/api/auth/login',
  '/api/auth/verify',
  '/_next/static',
  '/_next/image',
  '/favicon.ico'
];

// Check if path is public
const isPublicPath = (pathname: string) => {
  return publicPaths.some(path => pathname.startsWith(path));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = getTokenFromRequest(request);
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect API routes (except auth)
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    const token = getTokenFromRequest(request);
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};