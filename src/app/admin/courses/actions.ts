"use server"
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  if (!title) throw new Error("Título obrigatório");

  await prisma.course.create({ data: { title, description } });
  revalidatePath("/admin/courses");
}

export async function deleteCourse(id: string) {
  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/courses");
}

export async function createModule(courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const order = parseInt(formData.get("order") as string) || 0;
  await prisma.module.create({ data: { courseId, title, order } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteModule(id: string, courseId: string) {
  await prisma.module.delete({ where: { id } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateModule(id: string, courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const order = parseInt(formData.get("order") as string) || 0;
  await prisma.module.update({ where: { id }, data: { title, order } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function createLesson(moduleId: string, courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const pdfUrl = formData.get("pdfUrl") as string;
  const order = parseInt(formData.get("order") as string) || 0;
  await prisma.lesson.create({ data: { moduleId, title, videoUrl, pdfUrl, order } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateLesson(id: string, courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const pdfUrl = formData.get("pdfUrl") as string;
  const order = parseInt(formData.get("order") as string) || 0;
  await prisma.lesson.update({ where: { id }, data: { title, videoUrl, pdfUrl, order } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteLesson(id: string, courseId: string) {
  await prisma.lesson.delete({ where: { id } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function createQuestion(courseId: string, formData: FormData) {
  const text = formData.get("text") as string;
  const options = [
    formData.get("opt0") as string,
    formData.get("opt1") as string,
    formData.get("opt2") as string,
    formData.get("opt3") as string,
  ].filter(Boolean);
  const correctOption = parseInt(formData.get("correctOption") as string) || 0;

  if (!text || options.length < 2) throw new Error("Pergunta inválida");

  await prisma.examQuestion.create({
    data: {
      courseId, text, correctOption,
      optionsJson: JSON.stringify(options)
    }
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteQuestion(id: string, courseId: string) {
  await prisma.examQuestion.delete({ where: { id } });
  revalidatePath(`/admin/courses/${courseId}`);
}
