"use server"
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) throw new Error("Todos os campos são obrigatórios");

  try {
    const password_hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, password_hash, role: "STUDENT" }
    });
    revalidatePath("/admin/users");
  } catch (error) {
    throw new Error("Erro ao criar aluno (Possível e-mail duplicado)");
  }
}

export async function deleteStudent(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
