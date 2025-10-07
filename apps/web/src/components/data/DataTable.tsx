import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "@fluentui/react-components";
import React from "react";

interface Column<T> {
  key: string;
  name: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  items: T[];
  columns: Column<T>[];
  emptyState?: React.ReactNode;
}

export function DataTable<T>({ items, columns, emptyState }: DataTableProps<T>) {
  if (!items.length) {
    return <>{emptyState ?? <p>Aucun élément.</p>}</>;
  }

  return (
    <Table aria-label="Tableau de données">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell key={column.key}>{column.name}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.render(item)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
