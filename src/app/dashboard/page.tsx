import prisma from "@/lib/db";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) return null;

  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: { lessons: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Treinamentos</h1>
        <p className="text-muted-foreground">Continue de onde parou ou inicie um novo treinamento obrigatório.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => {
          const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
          return (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Módulos: {course.modules.length}</p>
                <p className="text-sm text-gray-500">Aulas: {totalLessons}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/course/${course.id}`} className="w-full">
                  <Button className="w-full">Acessar Curso</Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
