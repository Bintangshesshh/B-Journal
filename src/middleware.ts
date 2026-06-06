import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'kunci_cadangan'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/api/upload', '/api/dashboard', '/api/auth/me']

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak!" },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]

    try {
      const secret = new TextEncoder().encode(JWT_SECRET_KEY)
      
      await jwtVerify(token, secret)
      
      return NextResponse.next()
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Token palsu atau kadaluwarsa!" },
        { status: 403 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}