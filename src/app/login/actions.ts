"use server"

import bcrypt from 'bcryptjs';
import prisma from "@/lib/db";
import { setSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" };
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return { error: "Credenciais inválidas" };
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    return { error: "Credenciais inválidas" };
  }

  await setSession({ id: user.id, name: user.name, role: user.role });

  return { success: true };
}
