import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createModule, deleteModule, createLesson, deleteLesson, createQuestion, deleteQuestion } from "../actions";
import { EditModuleModal, EditLessonModal } from "@/components/admin/EditComponents";

export default async function AdminCourseDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: { include: { lessons: true }, orderBy: { order: "asc" } },
      questions: true
    }
  });

  if (!course) notFound();

  return (
    <div className="space-y-8">
      <div className="flex gap-4 items-center">
        <Link href="/admin/courses"><Button variant="outline">Voltar</Button></Link>
        <h1 className="text-3xl font-bold">{course.title} <span className="text-gray-400 text-lg font-normal">Editando Curso</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado Esquerdo: Módulos e Aulas */}
        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader><CardTitle>Adicionar Módulo</CardTitle></CardHeader>
            <CardContent>
              <form action={createModule.bind(null, courseId)} className="flex gap-2">
                <Input name="title" required placeholder="Nova seção do curso" />
                <Input name="order" type="number" placeholder="Ordem" className="w-24" defaultValue={course.modules.length + 1} />
                <Button type="submit">Criar</Button>
              </form>
            </CardContent>
          </Card>

          {course.modules.map(mod => (
            <Card key={mod.id} className="border bg-slate-50">
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-100 rounded-t-lg">
                <span className="font-bold">{mod.order}. {mod.title}</span>
                <div className="flex gap-2">
                  <EditModuleModal courseId={courseId} mod={mod} />
                  <form action={async () => { "use server"; await deleteModule(mod.id, courseId); }}>
                    <Button variant="ghost" size="sm" className="text-red-500 h-6">Excluir</Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <ul className="space-y-2">
                  {mod.lessons.map(lesson => (
                    <li key={lesson.id} className="p-2 border rounded bg-white flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold text-blue-600 block">{lesson.order}. {lesson.title}</span>
                        {lesson.videoUrl && <span className="text-xs text-gray-500">Vídeo </span>}
                        {lesson.pdfUrl && <span className="text-xs text-gray-500">PDF </span>}
                        {lesson.audioUrl && <span className="text-xs text-gray-500">Áudio </span>}
                      </div>
                      <div className="flex gap-2">
                        <EditLessonModal courseId={courseId} lesson={lesson} />
                        <form action={async () => { "use server"; await deleteLesson(lesson.id, courseId); }}>
                          <Button variant="destructive" size="sm" className="h-6">Apagar</Button>
                        </form>
                      </div>
                    </li>
                  ))}
                  {mod.lessons.length === 0 && <p className="text-xs text-gray-400 italic">Nenhuma aula. Adicione abaixo.</p>}
                </ul>

                <form action={createLesson.bind(null, mod.id, courseId)} className="space-y-2 border-t pt-4 border-dashed">
                  <p className="text-sm font-semibold">Nova Aula</p>
                  <Input name="title" size={1} required placeholder="Título da Aula" className="h-8 text-sm" />
                  <Input name="videoUrl" size={1} placeholder="URL Embed YT/Vimeo" className="h-8 text-sm" />
                  <Input name="pdfUrl" size={1} placeholder="URL do PDF (Opcional)" className="h-8 text-sm" />
                  <Input name="audioUrl" size={1} placeholder="URL do Áudio (Opcional)" className="h-8 text-sm" />
                  <div className="flex gap-2">
                    <Input name="order" type="number" placeholder="Ord." defaultValue={mod.lessons.length + 1} className="h-8 w-20 text-sm" />
                    <Button size="sm" className="h-8 w-full">Adicionar Aula</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lado Direito: Avaliação */}
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Banco de Questões da Avaliação</h2>
            <p className="text-sm text-gray-600 mb-6">As questões abaixo comporão a avaliação final que libera a conclusão do treinamento.</p>
            
            <form action={createQuestion.bind(null, courseId)} className="space-y-4 bg-white p-4 border rounded shadow-sm">
              <Label className="font-bold text-md">Criar Nova Questão</Label>
              <Input name="text" required placeholder="Qual o item correto..." />
              <div className="pl-4 space-y-2 border-l-2">
                <div className="flex items-center gap-2">
                  <Input name="opt0" required placeholder="Alternativa 0 (A)" className="h-8 text-sm"/>
                </div>
                <div className="flex items-center gap-2">
                  <Input name="opt1" required placeholder="Alternativa 1 (B)" className="h-8 text-sm"/>
                </div>
                <div className="flex items-center gap-2">
                  <Input name="opt2" placeholder="Alternativa 2 (C)" className="h-8 text-sm"/>
                </div>
                <div className="flex items-center gap-2">
                  <Input name="opt3" placeholder="Alternativa 3 (D)" className="h-8 text-sm"/>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Label>A Correta é a N°:</Label>
                <select name="correctOption" className="border rounded px-2 py-1 h-8 text-sm bg-white" required>
                  <option value="0">Alt 0 (A)</option>
                  <option value="1">Alt 1 (B)</option>
                  <option value="2">Alt 2 (C)</option>
                  <option value="3">Alt 3 (D)</option>
                </select>
                <Button type="submit" size="sm" className="ml-auto">Adicionar Questão</Button>
              </div>
            </form>

            <div className="mt-6 space-y-3">
              {course.questions.map((q, i) => {
                const options = JSON.parse(q.optionsJson);
                return (
                  <Card key={q.id}>
                    <CardHeader className="py-2 px-3 bg-white flex flex-row items-center justify-between">
                      <span className="font-bold text-sm">Q{i + 1}. {q.text}</span>
                      <form action={async () => { "use server"; await deleteQuestion(q.id, courseId); }}>
                        <Button variant="ghost" size="sm" className="text-red-500 h-6 p-0 px-2">X</Button>
                      </form>
                    </CardHeader>
                    <CardContent className="px-3 pb-3 pt-0">
                      <ul className="text-xs space-y-1 mt-2 text-slate-600">
                        {options.map((o: string, idx: number) => (
                          <li key={idx} className={idx === q.correctOption ? "font-bold text-green-700" : ""}>
                            {idx === q.correctOption && "✓ "}[{idx}] {o}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
              {course.questions.length === 0 && <p className="text-sm italic opacity-70">Nenhuma questão. Crie a primeira acima.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
