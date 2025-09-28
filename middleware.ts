// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Protect only Vercel preview builds
  if (process.env.VERCEL_ENV !== 'preview') return NextResponse.next();

  const auth = req.headers.get('authorization');
  if (auth) {
    const [u, p] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    if (u === process.env.BASIC_AUTH_USER && p === process.env.BASIC_AUTH_PASS) {
      return NextResponse.next();
    }
  }
  return new NextResponse('Auth required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Preview"' }
  });
}

export const config = { matcher: ['/(.*)'] };
