/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  TrashIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { DataTablePagination } from "@/components/pagination";
import { deleteData, updateFinancial } from "@/service/financial";
import UpdateModalFinancial from "./update-modal-financials";
import { ViewProof } from "./view-proof";
import { DeleteModal } from "./delete-modal";

const columns: ColumnDef<ExpenseReportData>[] = [
  {
    accessorKey: "proof",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-28"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Comprovante
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center w-28">
          <ViewProof image={row.original.proof} title="" />
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          className="w-16"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.date;
      const dateFormatter = format(new Date(date), "dd/MM/yyyy");
      return <div className="capitalize w-24 ">{dateFormatter}</div>;
    },
  },

  {
    accessorKey: "supplier",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fornecedor
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("supplier")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const notBilled = row.original.status === "not_billed";
      return (
        <div
          className={`uppercase ${
            notBilled ? "text-red-500" : "text-green-500"
          }`}
        >
          {notBilled ? "Não faturado" : "Faturado"}
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Motivo
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("reason")}</div>
    ),
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="justify-end flex text-end"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const Valor = parseFloat(row.getValue("value"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Valor);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "Ações",
    header: () => <span className=" justify-end flex">Ações</span>,
    cell: ({ row }) => {
      const notBilled = row.original.status === "not_billed";
      const id = row.original.id;

      const status = notBilled ? "billed" : "not_billed";
      const payload = {
        status,
      };

      async function update() {
        try {
          await updateFinancial({ id, payload });
          window.location.reload();
        } catch (e) {
          console.log(e);
        }
      }
      return (
        <div className="flex  justify-end items-center gap-2">
          <Button
            className={`${notBilled ? "text-red-500" : "text-green-500"}`}
            variant={"outline"}
            onClick={update}
            size={"icon"}
          >
            {!notBilled ? <CheckIcon /> : <Cross2Icon />}
          </Button>
          <UpdateModalFinancial data={row.original} />
          <DeleteModal id={row.original.id} />
        </div>
      );
    },
  },
];
export type Payment = {
  id: string;
  Valor: number;
  Data: "pending" | "processing" | "success" | "failed";
  Motivo: string;
  Fornecedor: string;
};

interface ExpenseReportData {
  id: string;
  date: string;
  supplier: string;
  status: string;
  reason: string;
  value: number;
  proof: string;
}
interface DataTableProps {
  data: ExpenseReportData[];
  totalItems: number;
  itemsPerPage: number;
  page: number;
}

export function DataTable({
  data,
  totalItems,
  page,
  itemsPerPage,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 max-sm:flex-col gap-2">
        <Input
          placeholder="Pesquisar por fornecedor"
          value={
            (table.getColumn("supplier")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("supplier")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-4 max-sm:mr-0"
        />

        <Input
          placeholder="Pesquisar por motivo"
          value={(table.getColumn("reason")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("reason")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: any) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalItems > 10 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <DataTablePagination
                totalItems={totalItems}
                page={page}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
