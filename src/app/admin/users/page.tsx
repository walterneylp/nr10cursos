import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStudent, deleteStudent } from "./actions";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ where: { role: "STUDENT" }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Alunos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 border shadow-sm">
          <CardHeader>
            <CardTitle>Novo Aluno</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createStudent} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input name="name" required placeholder="João da Silva" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input name="email" type="email" required placeholder="joao@empresa.com" />
              </div>
              <div className="space-y-2">
                <Label>Senha Inicial</Label>
                <Input name="password" required type="text" placeholder="senha123" />
              </div>
              <Button type="submit" className="w-full">Cadastrar Aluno</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border shadow-sm">
          <CardHeader>
            <CardTitle>Alunos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="p-3 font-semibold">Nome</th>
                    <th className="p-3 font-semibold">E-mail</th>
                    <th className="p-3 font-semibold">Data Cad.</th>
                    <th className="p-3 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.createdAt.toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <form action={async () => { "use server"; await deleteStudent(u.id); }}>
                          <Button variant="destructive" size="sm">Remover</Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nenhum aluno cadastrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
