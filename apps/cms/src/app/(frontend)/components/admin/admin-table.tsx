'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  PaginationState,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@frontend/components/ui/table';
import { Button } from '@frontend/components/ui/button';
import { Card, CardContent } from '@frontend/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@frontend/components/ui/select';
import { Badge } from '@frontend/components/ui/badge';
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@frontend/components/ui/alert';

interface AdminTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  totalCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  sorting?: SortingState;
  emptyMessage?: string;
  loadingMessage?: string;
  enableSorting?: boolean;
  enablePagination?: boolean;
}

export default function AdminTable<T>({
  data,
  columns,
  isLoading = false,
  isError = false,
  error = null,
  totalCount,
  pageIndex = 0,
  pageSize = 10,
  onPaginationChange,
  onSortingChange,
  sorting = [],
  emptyMessage = 'Aucune donnée trouvée',
  loadingMessage = 'Chargement des données...',
  enableSorting = true,
  enablePagination = true,
}: AdminTableProps<T>) {
  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  const [localSorting, setLocalSorting] = useState<SortingState>(sorting);

  const handlePaginationChange = (updater: any) => {
    const newPagination = typeof updater === 'function' ? updater(localPagination) : updater;
    setLocalPagination(newPagination);
    onPaginationChange?.(newPagination);
  };

  const handleSortingChange = (updater: any) => {
    const newSorting = typeof updater === 'function' ? updater(localSorting) : updater;
    setLocalSorting(newSorting);
    onSortingChange?.(newSorting);
  };

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      pagination: localPagination,
      sorting: localSorting,
    },
    pageCount: totalCount ? Math.ceil(totalCount / pageSize) : -1,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    manualPagination: !!onPaginationChange,
    manualSorting: !!onSortingChange,
    enableSorting,
  });

  const getSortIcon = (column: any) => {
    const sorted = column.getIsSorted();
    if (sorted === 'asc') return <ArrowUp className="w-4 h-4" />;
    if (sorted === 'desc') return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-50/50">
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id}
                        className="font-semibold text-gray-900"
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center space-x-2">
                            <span>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            {enableSorting && header.column.getCanSort() && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-gray-200"
                                onClick={() => header.column.toggleSorting()}
                              >
                                {getSortIcon(header.column)}
                              </Button>
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-gray-500">{loadingMessage}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center">
                      <Alert variant="destructive" className="max-w-md mx-auto">
                        <AlertTitle>Erreur de chargement</AlertTitle>
                        <AlertDescription>
                          {error?.message || 'Une erreur est survenue lors du chargement des données.'}
                        </AlertDescription>
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow 
                      key={row.id}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/25'
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-4xl text-gray-300">📊</div>
                        <span className="text-gray-500">{emptyMessage}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-600">
            {totalCount ? (
              <>
                Affichage de {localPagination.pageIndex * localPagination.pageSize + 1} à{' '}
                {Math.min((localPagination.pageIndex + 1) * localPagination.pageSize, totalCount)} sur{' '}
                {totalCount} résultats
              </>
            ) : (
              `Page ${localPagination.pageIndex + 1} sur ${table.getPageCount()}`
            )}
          </div>
          
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Résultats par page</p>
              <Select
                value={localPagination.pageSize.toString()}
                onValueChange={(value) => {
                  handlePaginationChange({
                    ...localPagination,
                    pageSize: Number(value),
                    pageIndex: 0,
                  });
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={localPagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePaginationChange({ ...localPagination, pageIndex: 0 })}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePaginationChange({ 
                  ...localPagination, 
                  pageIndex: localPagination.pageIndex - 1 
                })}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePaginationChange({ 
                  ...localPagination, 
                  pageIndex: localPagination.pageIndex + 1 
                })}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePaginationChange({ 
                  ...localPagination, 
                  pageIndex: table.getPageCount() - 1 
                })}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for status badges
export function StatusBadge({ 
  status, 
  variant = 'default' 
}: { 
  status: string; 
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' 
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <Badge className={`${variants[variant]} border-0`}>
      {status}
    </Badge>
  );
}