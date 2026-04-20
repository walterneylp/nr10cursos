# Plataforma de Treinamentos NR10 - Design Document

## 1. Resumo do Entendimento
* **O Que:** Uma plataforma web de treinamentos (inicialmente NR10 Básico e SEP), com progressão sequencial nas aulas e testes de múltipla escolha como avaliação final.
* **Por Que:** Para organizar a entrega e consumo do material, além de avaliar o aprendizado de forma centralizada.
* **Para Quem:** 
   * **Administradores:** Com acesso à gestão completa do fluxo (criar alunos, aprovar acessos, gerenciar materiais e visualizar notas).
   * **Alunos:** Consome aulas/PDFs sequencialmente e executa o teste.
* **Infraestrutura:** Servidor isolado rodando em Docker (`192.168.20.200`, domínio `nr10cursos.apogeuautomacao.ia.br`). Repositório central no Github.
* **Não-Objetivos:** A plataforma nativa **não** vai emitir certificado em PDF automaticamente para o aluno nem vai armazenar arquivos de vídeo pesados no próprio servidor.

## 2. Premissas Tecnológicas (Assumptions)
* **Framework:** Next.js (React) com App Router para unificar interfaces e API num só repositório.
* **Banco de Dados:** SQLite via ORM (Prisma). Rodará de forma muito leve dentro do único container do Node.js, sendo perfeito para cargas baixas/médias. 
* **Estilização:** TailwindCSS para interfaces modernas com rápida personalização.
* **Segurança:** Senhas com hash e login via sessões seguras usando JWT ou cookies encriptados. Rotas protegidas (alunos x tela admin).

## 3. Log de Decisões
* **[Decisão 1] Criação de contas:** O Administrador realiza o registro e cede o acesso ao aluno.
    * **Alternativa considerada:** Auto-cadastro aberto.
    * **Por que escolhido:** Maior rigidez e segurança de quem pode visualizar os treinamentos corporativos.
* **[Decisão 2] Emissão de Certificados:** Ocorrência fora do sistema. A plataforma só exibe aprovações/reprovações para o Admin.
    * **Alternativa considerada:** Geração automática em PDF no momento de passar na prova.
    * **Por que escolhido:** Mantém a plataforma focada apenas no aprendizado. Elimina necessidade de geradores de PDF e assinaturas no MVP.
* **[Decisão 3] Vídeos e Bloqueios:** Vídeos embutidos de fora e navegação obrigatoriamente sequencial com "Check" em cada módulo concluído.
    * **Alternativa considerada:** Fazer upload local ou navegação totalmente livre.
    * **Por que escolhido:** Evita o custo de banda do servidor e força o aluno a cumprir integralmente o cronograma NR10 antes de tomar o teste.
* **[Decisão 4] Gestão Dinâmica (CMS):** Cursos, apostilas, módulos e perguntas das provas 100% gerenciáveis pelo painel admin.
    * **Alternativa considerada:** Material chumbado no banco de dados sem painel de edição de curso.
    * **Por que escolhido:** Facilita alterações nas normas vigentes e atualizações nos conteúdos sem precisar refazer código.

## 4. Design Final: Entidades e Fluxo de Telas

### Fluxo de Telas
* `/login`: Acesso geral (Email e Senha).
* `/admin/dashboard`: Visão panorâmica dos alunos e notas recentes.
* `/admin/usuarios`: CRUD de usuários e alunos.
* `/admin/cursos`: Central de edições com os Módulos, Aulas e Banco de Questões da Prova.
* `/dashboard`: Lista de Cursos que o Aluno tem acesso.
* `/dashboard/curso/<ID>`: Índice de módulos listando aulas abertas ou travadas.
* `/dashboard/aula/<ID>`: Player embedado + Link do PDF + Botão "Concluir Aula".
* `/dashboard/avaliacao`: Tela do teste com múltipla escolha. Habilitado somente se `Aulas Concluídas == Total Aulas`.

### Entidades do Banco
* **User:** id, name, email, password_hash, role, created_at.
* **Course:** id, title, description, created_at.
* **Module:** id, course_id, title, order.
* **Lesson:** id, module_id, title, description, video_url, pdf_url, order.
* **ExamQuestion:** id, course_id, text, correct_option, (options via JSON text).
* **LessonProgress:** id, user_id, lesson_id, completed_at
* **TestAttempt:** id, user_id, course_id, score, passed, created_at.
