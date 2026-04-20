import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const usersCount = await prisma.user.count({ where: { role: "STUDENT" } });
  const coursesCount = await prisma.course.count();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Resumo do Sistema</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alunos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{usersCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cursos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{coursesCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
