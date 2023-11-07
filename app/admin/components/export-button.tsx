"use client";
import { Button } from "@/components/ui/button";
import { exportData } from "@/service/financial";

export default function ButtonExport() {
  return (
    <Button variant={"outline"} className="max-sm:w-full" onClick={exportData}>
      Exportar
    </Button>
  );
}
