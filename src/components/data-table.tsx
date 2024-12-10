// src/components/DataTable.tsx
"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ColumnDef } from "@tanstack/react-table";

export type ProjectCost = {
  projectId: number;
  projectSalaryCosts: number;
  budget: number;
  costFraction: number;
};

export const columns: ColumnDef<ProjectCost>[] = [
  {
    accessorKey: "projectId",
    header: "ID del Proyecto",
  },
  {
    accessorKey: "projectSalaryCosts",
    header: "Costos Salariales del Proyecto (€)",
    cell: ({ getValue }) => {
      const value = getValue();
      if (typeof value === "number") {
        return value.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        });
      }
      return "N/A";
    },
  },
  {
    accessorKey: "budget",
    header: "Presupuesto (€)",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
      });
    },
  },
  {
    accessorKey: "costFraction",
    header: "Fracción del Costo (%)",
    cell: ({ getValue }) => {
      const value = getValue();
      if (typeof value === "number") {
        return `${value.toFixed(2)}%`;
      }
      return "N/A";
    },
  },
];

interface DataTableProps {
  data: ProjectCost[];
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
