import { NextResponse } from 'next/server';

const protectedPaths = ['/leads', '/kanban'];
const authPaths = ['/login', '/register'];
const SESSION_COOKIE = 'workdesk_rt';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath && !sessionToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && sessionToken) {
    return NextResponse.redirect(new URL('/leads', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/leads/:path*', '/kanban/:path*']
};
