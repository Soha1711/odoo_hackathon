import React from 'react';
import { cn } from '../../lib/utils';
import Skeleton from './Skeleton';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found.',
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-border bg-card', className)}>
      <table className="w-full text-sm text-left text-foreground border-collapse">
        <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground border-b border-border/50">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className="px-3 sm:px-6 py-4 font-semibold tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/45">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rIdx) => (
              <tr key={rIdx}>
                {columns.map((_, cIdx) => (
                  <td key={cIdx} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rIdx) => (
              <tr key={rIdx} className="hover:bg-muted/10 transition-colors">
                {columns.map((col, cIdx) => {
                  const val = col.cell
                    ? col.cell(item)
                    : (item[col.accessorKey as keyof T] as unknown as React.ReactNode);
                  return (
                      <td key={cIdx} className="px-3 sm:px-6 py-4 text-sm font-medium">
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
export default DataTable;
