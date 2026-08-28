import { NextResponse } from "next/server";


const PROTECTED_ROUTES = ['/meals/share-meal'];


export function middleware(request) {
  const sessionCookie = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redrectTo', pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/meals/share-meal/:path*'],
};