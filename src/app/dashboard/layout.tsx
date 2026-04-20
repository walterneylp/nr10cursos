import { getSession, logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen />
            <span>NR10 Cursos</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Olá, {session.user.name}</span>
            <form action={async () => { "use server"; await logout(); redirect("/login"); }}>
              <button type="submit" className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
                <LogOut size={16} /> Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
