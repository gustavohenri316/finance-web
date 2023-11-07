"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DataTablePaginationProps<TData> {
  totalItems: number;
  itemsPerPage: number;
  page: number;
}

export function DataTablePagination<TData>({
  totalItems,
  itemsPerPage,
  page,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium max-sm:hidden">Itens por página</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(e) => router.push(`?page=1&itemsPerPage=${e}`)}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder="10">
                {itemsPerPage.toString()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50, 80, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm whitespace-nowrap font-medium">
          Página {page} de {Math.ceil(totalItems / itemsPerPage)}
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`?page=1&itemsPerPage=${itemsPerPage}`}>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={page === 1}
            >
              <span className="sr-only">Ir para a primeira página</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link
            href={`?page=${
              page > 1 ? page - 1 : 1
            }&itemsPerPage=${itemsPerPage}`}
          >
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              disabled={page === 1}
            >
              <span className="sr-only">Ir para a página anterior</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`?page=${page + 1}&itemsPerPage=${itemsPerPage}`}>
            <Button variant="outline" className="h-8 w-8 p-0">
              <span className="sr-only">Ir para a próxima página</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link
            href={`?page=${Math.ceil(
              totalItems / itemsPerPage
            )}&itemsPerPage=${itemsPerPage}`}
          >
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={page * itemsPerPage >= totalItems}
            >
              <span className="sr-only">Ir para a última página</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
