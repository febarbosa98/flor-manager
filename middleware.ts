import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")

  const isLoginPage = request.nextUrl.pathname === "/login"

  // Se NÃO estiver logado e tentar acessar outra página
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Se estiver logado e tentar acessar login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/produtos", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"]
}