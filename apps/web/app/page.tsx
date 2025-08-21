"use client";

import { useState } from "react";
import { useFetchCampaign } from "@/lib/hooks/campaign/useFetchCampaign";
import {
  ColumnDef,
  RowSelectionState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Campaign } from "@placement-io-oms/utils/types";
import useTablePagination from "@/lib/hooks/pagination/useTablePagination";

export default function Home() {
  // Get all campaigns
  const { data: campaigns, isLoading } = useFetchCampaign();

  // Sorting and selecting state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // React table
  const columnHelper = createColumnHelper<Campaign>();

  // Column schema
  const columns: ColumnDef<Campaign, any>[] = [
    columnHelper.accessor((row) => row, {
      id: "campaignId",
      header: () => <div>Id</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return <div>{row.original.id}</div>;
      },
    }),
    columnHelper.accessor((row) => row, {
      id: "campaignName",
      header: () => <div>Name</div>,
      size: 500,
      enableSorting: false,
      cell: ({ row }) => {
        return <div>{row.original.name}</div>;
      },
    }),
  ];

  const table = useReactTable({
    data: campaigns ?? [],
    columns,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    state: {
      sorting: sorting,
      rowSelection: rowSelection,
    },
  });

  // Pagination
  const { paginationList, currentPage, onPaginationChange } =
    useTablePagination({
      table,
      pageSize: 20,
    });

  return (
    <div className="">
      <main>
        <table>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const sortValue = header.column.getIsSorted() as string;

                  if (header.isPlaceholder) return null;

                  return (
                    <th key={header.id} style={{ width: header.getSize() }}>
                      {header.column.getCanSort() ? (
                        <div className="flex gap-x-2 justify-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <div>^</div>
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody></tbody>
        </table>
      </main>
    </div>
  );
}
