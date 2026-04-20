import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createCourse, deleteCourse } from "./actions";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({ 
    include: { _count: { select: { modules: true, questions: true } } },
    orderBy: { createdAt: "desc" } 
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 border shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Novo Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCourse} className="space-y-4">
              <div className="space-y-2">
                <Label>Título do Curso</Label>
                <Input name="title" required placeholder="NR10 - Sep" />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input name="description" placeholder="Treinamento completo..." />
              </div>
              <Button type="submit" className="w-full">Criar Curso</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border shadow-sm">
          <CardHeader>
            <CardTitle>Cursos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="p-3 font-semibold">Título</th>
                    <th className="p-3 font-semibold text-center">Módulos</th>
                    <th className="p-3 font-semibold text-center">Questões</th>
                    <th className="p-3 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {courses.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-blue-600">
                        <Link href={`/admin/courses/${c.id}`}>{c.title}</Link>
                      </td>
                      <td className="p-3 text-center">{c._count.modules}</td>
                      <td className="p-3 text-center">{c._count.questions}</td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <Link href={`/admin/courses/${c.id}`}>
                          <Button variant="outline" size="sm">Editar</Button>
                        </Link>
                        <form action={async () => { "use server"; await deleteCourse(c.id); }}>
                          <Button variant="destructive" size="sm">Apagar</Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nenhum curso cadastrado.</td></tr>
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
