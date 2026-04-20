"use server"
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function submitExam(courseId: string, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Sem sessão");

  const questions = await prisma.examQuestion.findMany({
    where: { courseId }
  });

  if (questions.length === 0) throw new Error("Sem questões");

  let correctCount = 0;
  questions.forEach(q => {
    const answeredOpt = parseInt(formData.get(`q_${q.id}`) as string);
    if (answeredOpt === q.correctOption) {
      correctCount++;
    }
  });

  const score = (correctCount / questions.length) * 10;
  const passed = score >= 7.0;

  await prisma.testAttempt.create({
    data: {
      userId: session.user.id,
      courseId,
      score,
      passed
    }
  });

  redirect(`/dashboard/course/${courseId}/exam/result?score=${score}`);
}
