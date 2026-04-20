"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateModule, updateLesson } from "@/app/admin/courses/actions";

export function EditModuleModal({ courseId, mod }: { courseId: string, mod: any }) {
  const [open, setOpen] = useState(false);

  async function handleUpdate(formData: FormData) {
    await updateModule(mod.id, courseId, formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6">Editar Módulo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Módulo</DialogTitle>
        </DialogHeader>
        <form action={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label>Título do Módulo</Label>
            <Input name="title" required defaultValue={mod.title} />
          </div>
          <div className="space-y-2">
            <Label>Ordem</Label>
            <Input name="order" type="number" defaultValue={mod.order} />
          </div>
          <Button type="submit" className="w-full">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditLessonModal({ courseId, lesson }: { courseId: string, lesson: any }) {
  const [open, setOpen] = useState(false);

  async function handleUpdate(formData: FormData) {
    await updateLesson(lesson.id, courseId, formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6">Editar Aula</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Aula</DialogTitle>
        </DialogHeader>
        <form action={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label>Título da Aula</Label>
            <Input name="title" required defaultValue={lesson.title} />
          </div>
          <div className="space-y-2">
            <Label>URL do Vídeo</Label>
            <Input name="videoUrl" defaultValue={lesson.videoUrl || ""} />
          </div>
          <div className="space-y-2">
            <Label>URL do PDF</Label>
            <Input name="pdfUrl" defaultValue={lesson.pdfUrl || ""} />
          </div>
          <div className="space-y-2">
            <Label>Ordem</Label>
            <Input name="order" type="number" defaultValue={lesson.order} />
          </div>
          <Button type="submit" className="w-full">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
