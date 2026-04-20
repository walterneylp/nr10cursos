import { getSession, logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, LayoutDashboard, Users, BookMarked } from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-800">
          Admin NR10
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded">
            <LayoutDashboard size={18} /> Resumo
          </Link>
          <Link href="/admin/users" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded">
            <Users size={18} /> Alunos
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded">
            <BookMarked size={18} /> Cursos & Módulos
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <form action={async () => { "use server"; await logout(); redirect("/login"); }}>
            <button type="submit" className="flex items-center gap-2 text-slate-300 hover:text-white w-full">
              <LogOut size={18} /> Sair do Painel
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
