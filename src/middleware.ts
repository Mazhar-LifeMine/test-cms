import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = (req as any).nextauth?.token
    const pathname = req.nextUrl.pathname

    const slugMatch = pathname.match(/^\/([^\/]+)$/)
    if (slugMatch) {
      const slug = slugMatch[1]

      const skipPaths = ['login', 'api', '_next', 'favicon', 'og-image', 'admin']
      if (skipPaths.some((p) => slug.startsWith(p))) {
        return NextResponse.next()
      }

      if (token?.role === 'admin') {
        return NextResponse.next()
      }

      const allowedSlugs: string[] = token?.allowedSlugs ?? []
      if (!allowedSlugs.includes(slug)) {
        return NextResponse.redirect(new URL('/?error=access_denied', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/login',
    },
  },
)

export const config = {
  matcher: ['/((?!admin|login|api/auth|api|_next/static|_next/image|favicon.ico|og-image.png).*)'],
}
