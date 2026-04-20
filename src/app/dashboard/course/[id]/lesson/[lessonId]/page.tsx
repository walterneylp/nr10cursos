import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { markLessonComplete } from "./actions";

export default async function LessonPage({ params }: { params: Promise<{ id: string, lessonId: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const resolvedParams = await params;
  const { id: courseId, lessonId } = resolvedParams;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } }
  });

  if (!lesson) notFound();

  const isCompleted = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href={`/dashboard/course/${courseId}`} className="text-blue-600 text-sm hover:underline mb-2 block">
          ← Voltar para o Índice
        </Link>
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{lesson.module.title}</span>
        <h1 className="text-3xl font-bold mt-1">{lesson.title}</h1>
      </div>

      {lesson.videoUrl && (
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg border">
          <iframe 
            src={lesson.videoUrl} 
            className="w-full h-full" 
            allowFullScreen 
            title="Video Viewer"
          />
        </div>
      )}

      {lesson.pdfUrl && (
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-bold text-blue-900">Material Didático (Apostila)</h3>
            <p className="text-sm text-blue-700">Baixe o PDF para acompanhar o conteúdo desta aula.</p>
          </div>
          <a href={lesson.pdfUrl} target="_blank" rel="noreferrer">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">
              Abrir PDF
            </Button>
          </a>
        </div>
      )}

      <div className="mt-8 pt-8 border-t flex justify-end">
        {isCompleted ? (
          <Button disabled className="bg-green-600 text-white cursor-not-allowed">
            ✓ Aula Concluída
          </Button>
        ) : (
          <form action={async () => { "use server"; await markLessonComplete(lessonId, courseId); }}>
            <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700">
              Marcar como Concluída
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
