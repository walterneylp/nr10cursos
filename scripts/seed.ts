import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create ADMIN
  const adminPassword = await bcrypt.hash('2025', 10)
  await prisma.user.upsert({
    where: { email: 'apogeu@192.168.20.200' },
    update: {},
    create: {
      email: 'apogeu@192.168.20.200', // Requested by user in prompt (well, they said "o acesso a ele é apogeu@192.168.20.200 com pass 2025") Wait, apogeu@192.168.20.200 is their SSH login, but maybe good for app admin too. We'll use admin@nr10cursos.com.br and apogeu@192.168.20.200
      name: 'Admin',
      password_hash: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create Student
  await prisma.user.upsert({
    where: { email: 'aluno@curso.com' },
    update: {},
    create: {
      email: 'aluno@curso.com',
      name: 'Aluno Teste',
      password_hash: await bcrypt.hash('1234', 10),
      role: 'STUDENT',
    },
  })

  // Create course
  let course = await prisma.course.findFirst({ where: { title: 'NR10 - Básico' } })
  if (!course) {
    course = await prisma.course.create({
      data: {
        title: 'NR10 - Básico',
        description: 'Curso Básico Segurança em Instalações e Serviços em Eletricidade',
        modules: {
          create: [{
            title: 'Módulo 1 - Introdução',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Aula 1 - O que é a NR10?',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  order: 1
                },
                {
                  title: 'Aula 2 - Riscos Elétricos',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  order: 2
                }
              ]
            }
          }]
        }
      }
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
