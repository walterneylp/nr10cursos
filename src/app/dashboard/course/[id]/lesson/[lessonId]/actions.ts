"use server"
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function markLessonComplete(lessonId: string, courseId: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: {},
    create: { userId: session.user.id, lessonId }
  });

  redirect(`/dashboard/course/${courseId}`);
}
