import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Only protect previews
  if (process.env.PREVIEW_PROTECT !== '1') return NextResponse.next();

  const auth = req.headers.get('authorization');
  if (auth) {
    const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64')
      .toString()
      .split(':');
    if (user === process.env.BASIC_AUTH_USER && pass === process.env.BASIC_AUTH_PASS) {
      return NextResponse.next();
    }
  }
  return new NextResponse('Auth required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Preview"' }
  });
}

export const config = { matcher: ['/(.*)'] };
