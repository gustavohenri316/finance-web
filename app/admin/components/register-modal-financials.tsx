"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/currency-input";
import { api } from "@/service/api";
import { uploadImages } from "@/components/upload-images";
import { useState } from "react";

const formSchema = z.object({
  date: z
    .string()
    .min(1, { message: "A data é obrigatória" })
    .max(255, { message: "A data não pode ter mais de 255 caracteres" }),
  supplier: z
    .string()
    .min(1, { message: "O fornecedor é obrigatório" })
    .max(255, { message: "O fornecedor não pode ter mais de 255 caracteres" }),
  reason: z
    .string()
    .min(1, { message: "O motivo é obrigatório" })
    .max(255, { message: "O motivo não pode ter mais de 255 caracteres" }),
  value: z
    .string()
    .min(1, { message: "O valor é obrigatório" })
    .max(255, { message: "O valor não pode ter mais de 255 caracteres" }),
  proof: z.string(),
});

export default function RegisterModalFinancial() {
  const [image, setImage] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      reason: "",
      supplier: "",
      value: "",
      proof: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      date: values.date,
      supplier: values.supplier,
      reason: values.reason,
      value: parseFloat(values.value),
      proof: image,
    };

    try {
      await api.post("/expense-reports", payload);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  }

  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImages(e, setImage, setLoading);
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {};
      reader.readAsDataURL(file);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="max-sm:w-full">Nova Entrada</Button>
      </DialogTrigger>
      <DialogContent className="max-sm:w-full max-sm:text-lg">
        <DialogHeader>
          <DialogTitle>Nova Entrada de Despesas</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 max-sm:space-y-4 "
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex:. Bar do Mauro" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex:. Alojamento " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      onValueChange={field.onChange}
                      value={Number(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proof"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comprovante</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={handleImageChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Carregando..." : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
