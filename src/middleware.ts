import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  // Definição de rotas
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isStudentRoute = request.nextUrl.pathname.startsWith('/dashboard')

  // Se estiver sem sessão, redireciona para login (se tentar acessar rotas protegidas)
  if (!session && (isAdminRoute || isStudentRoute)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session) {
    try {
      const parsedSession = await decrypt(session)
      const role = parsedSession.user.role

      // Redireciona o usuário logado se tentar acessar a página "/" ou "/login"
      if (request.nextUrl.pathname === '/' || isLoginPage) {
        if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        if (role === 'STUDENT') return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Proíbe estudantes de acessarem rota admin e vice-versa
      if (isAdminRoute && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      if (isStudentRoute && role !== 'STUDENT') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      
    } catch (e) {
      // Se a sessão for inválida, limpa e manda pro login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
