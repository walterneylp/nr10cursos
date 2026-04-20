import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function StudentCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const userId = session.user.id;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  const progresses = await prisma.lessonProgress.findMany({
    where: { userId, lesson: { module: { courseId } } }
  });

  const completedLessonIds = new Set(progresses.map(p => p.lessonId));

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = completedLessonIds.size;
  const isCourseComplete = totalLessons > 0 && completedLessons === totalLessons;

  // Encontrar a próxima aula para fazer
  let nextLessonUrl = null;
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      if (!completedLessonIds.has(lesson.id)) {
        nextLessonUrl = `/dashboard/course/${courseId}/lesson/${lesson.id}`;
        break;
      }
    }
    if (nextLessonUrl) break;
  }

  // Se tudo pronto mas sem botão de continuar, ele já fez tudo
  const actionButton = isCourseComplete ? (
    <Link href={`/dashboard/course/${courseId}/exam`} className="w-full">
      <Button className="w-full bg-green-600 hover:bg-green-700">Fazer Avaliação Final</Button>
    </Link>
  ) : nextLessonUrl ? (
    <Link href={nextLessonUrl} className="w-full">
      <Button className="w-full">Continuar Treinamento</Button>
    </Link>
  ) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Link href="/dashboard" className="text-blue-600 text-sm hover:underline mb-2 block">← Voltar</Link>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold mb-1">Progresso: {completedLessons}/{totalLessons} Aulas</p>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${totalLessons > 0 ? (completedLessons/totalLessons)*100 : 0}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">{isCourseComplete ? "Treinamento Concluído!" : "Seu Próximo Passo:"}</h3>
          <p className="text-sm text-gray-500">
            {isCourseComplete ? "Vá para a avaliação e teste seus conhecimentos." : "Clique ao lado para assistir a próxima aula."}
          </p>
        </div>
        <div className="w-64">
          {actionButton}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">Conteúdo Programático</h2>
        
        {course.modules.map((mod, modIdx) => (
          <Card key={mod.id}>
            <CardHeader className="bg-slate-50 border-b p-4">
              <CardTitle className="text-lg">Módulo {modIdx + 1}: {mod.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mod.lessons.map((lesson, lessonIdx) => {
                  const isCompleted = completedLessonIds.has(lesson.id);
                  return (
                    <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs 
                          ${isCompleted ? 'bg-green-500 border-green-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                          {isCompleted ? "✓" : (lessonIdx + 1)}
                        </div>
                        <span className={isCompleted ? "text-gray-800 font-medium" : "text-gray-600"}>
                          Aula: {lesson.title}
                        </span>
                      </div>
                      {isCompleted ? (
                        <span className="text-green-600 font-bold text-sm">Concluído</span>
                      ) : (
                        <Link href={`/dashboard/course/${courseId}/lesson/${lesson.id}`}>
                          <Button variant="outline" size="sm">Acessar</Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
