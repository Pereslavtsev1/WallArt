import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';
export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  if (sessionCookie && ['/login', '/signup'].includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (!sessionCookie && pathname.startsWith('/settings')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup'],
};
