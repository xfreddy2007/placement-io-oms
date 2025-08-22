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
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import TableHeadBar, { FilterObjectType } from "@/components/TableHeadBar";

export default function Home() {
  // router
  const router = useRouter();

  // Get all campaigns
  const { data: campaigns, isLoading } = useFetchCampaign();

  // Sorting and selecting state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "campaignId", desc: false },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // React table
  const columnHelper = createColumnHelper<Campaign>();

  // Column schema
  const columns: ColumnDef<Campaign, any>[] = [
    columnHelper.accessor((row) => row.id, {
      id: "campaignId",
      header: () => <div>Id</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return <div>{row.original.id}</div>;
      },
    }),
    columnHelper.accessor((row) => row.name, {
      id: "campaignName",
      header: () => <div>Name</div>,
      filterFn: (row, columnId, filterValue: FilterObjectType) => {
        const { searchValue } = filterValue;
        const campaignName = row.getValue(columnId) as string;
        return campaignName.toLowerCase().includes(searchValue);
      },
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
    <main className="w-full">
      <section className="flex flex-col items-center gap-y-4 p-4">
        <h1 className="text-2xl w-full text-center font-bold">Campaigns</h1>
        <TableHeadBar<Campaign> table={table} filterTarget="campaignName" />
        <table className="border-2 border-solid border-black w-full">
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const sortValue = header.column.getIsSorted() as string;

                  const sortIconMap = {
                    asc: "sort-up",
                    desc: "sort-down",
                  };

                  if (header.isPlaceholder) return null;

                  return (
                    <th
                      key={header.id}
                      className="bg-gray-600 text-gray-200"
                      style={{ width: header.getSize() }}
                    >
                      {header.column.getCanSort() ? (
                        <div
                          className="flex gap-x-2 justify-center items-center cursor-pointer p-3"
                          onClick={() => {
                            header.column.toggleSorting();
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <div className="h-full">
                            <img
                              src={`/Icon/svg/${sortValue ? sortIconMap[sortValue as keyof typeof sortIconMap] : "sort-up-down"}.svg`}
                              alt="sort-icon"
                              loading="lazy"
                              className="h-full w-auto"
                            />
                          </div>
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
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  className="w-full py-16 text-center font-bold"
                  colSpan={columns.length}
                >
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    router.push(`/${row.original.id}/line-item`);
                  }}
                  className="cursor-pointer hover:bg-gray-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-1">
                      <div className="pl-0 pr-2 first:px-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="w-full py-16 text-center font-bold"
                  colSpan={columns.length}
                >
                  No Campaign found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          hasPreviousHiddenPagination={(paginationList.at(0) ?? 0) > 1}
          isNextPageCtaDisabled={!table.getCanNextPage()}
          isPreviousPageCtaDisabled={!table.getCanPreviousPage()}
          paginationList={paginationList}
          hasNextHiddenPagination={
            (paginationList.at(-1) ?? 0) !== currentPage &&
            (paginationList.at(-1) ?? 0) < table.getPageCount()
          }
          onPaginationChange={onPaginationChange}
        />
      </section>
    </main>
  );
}
