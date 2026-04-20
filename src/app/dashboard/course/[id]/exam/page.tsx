import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitExam } from "./actions";

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { questions: true }
  });

  if (!course) notFound();

  if (course.questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Erro: Avaliação Indisponível</h1>
        <p className="mt-4">O administrador ainda não cadastrou questões para este curso.</p>
        <Link href={`/dashboard/course/${courseId}`}><Button className="mt-6">Voltar</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div>
        <Link href={`/dashboard/course/${courseId}`} className="text-blue-600 text-sm hover:underline mb-2 block">
          ← Voltar
        </Link>
        <h1 className="text-3xl font-bold">Avaliação Final</h1>
        <p className="text-gray-600">Responda todas as perguntas. Mínimo de 70% de acertos para aprovação.</p>
      </div>

      <form action={submitExam.bind(null, courseId)} className="space-y-6">
        {course.questions.map((q, i) => {
          const options = JSON.parse(q.optionsJson);
          return (
            <Card key={q.id}>
              <CardContent className="p-6">
                <p className="font-bold text-lg mb-4">{i + 1}. {q.text}</p>
                <div className="space-y-3 pl-2">
                  {options.map((opt: string, idx: number) => (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`q_${q.id}`} 
                        value={idx.toString()} 
                        required 
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="pt-6 border-t flex justify-end">
          <Button type="submit" size="lg" className="w-full md:w-auto font-bold px-8">
            Finalizar Avaliação
          </Button>
        </div>
      </form>
    </div>
  );
}
