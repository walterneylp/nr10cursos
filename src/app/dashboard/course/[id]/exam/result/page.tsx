import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ExamResultPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ score?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const courseId = resolvedParams.id;
  const scoreRaw = resolvedSearchParams.score;
  if (!scoreRaw) redirect(`/dashboard/course/${courseId}`);

  const score = parseFloat(scoreRaw);
  const passed = score >= 7.0;

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6 text-center">
      <Card className={`border-2 ${passed ? "border-green-500" : "border-red-500"}`}>
        <CardContent className="pt-8 pb-8 flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 ${passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {passed ? "🏆" : "❌"}
          </div>
          <h1 className="text-3xl font-bold mb-2">{passed ? "Aprovado!" : "Reprovado"}</h1>
          <p className="text-xl mb-4">Nota: {score.toFixed(1)} / 10.0</p>
          <p className="text-gray-500 mb-8">
            {passed 
              ? "Parabéns, você completou satisfatoriamente o treinamento." 
              : "Você não atingiu a média mínima. Tente novamente."}
          </p>

          {passed ? (
            <Link href="/dashboard"><Button className="w-full">Voltar ao Início</Button></Link>
          ) : (
            <Link href={`/dashboard/course/${courseId}/exam`}><Button variant="outline" className="w-full">Refazer Avaliação</Button></Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
