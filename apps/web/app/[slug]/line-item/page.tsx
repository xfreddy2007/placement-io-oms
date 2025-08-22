"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchLineItems } from "@/lib/hooks/lineItem/useFetchLineItems";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { LineItem } from "@placement-io-oms/utils/types";
import useTablePagination from "@/lib/hooks/pagination/useTablePagination";
import Pagination from "@/components/Pagination";

export default function LineItemPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = use(params);

  const router = useRouter();

  if (isNaN(Number(slug[0]))) {
    router.push("/");
  }

  // Get all line items from the provided campaign id
  const { data: lineItems, isLoading } = useFetchLineItems(Number(slug[0]));

  // Sorting and selecting state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // React table
  const columnHelper = createColumnHelper<LineItem>();

  // Column schema
  const columns: ColumnDef<LineItem, any>[] = [
    columnHelper.accessor((row) => row.id, {
      id: "id",
      header: () => <div>Id</div>,
      size: 50,
      enableSorting: true,
      cell: ({ row }) => {
        return <div>{row.original.id}</div>;
      },
    }),
    columnHelper.accessor((row) => row.lineItemName, {
      id: "lineItemName",
      header: () => <div>Line Item Name</div>,
      size: 200,
      enableSorting: false,
      cell: ({ row }) => {
        return <div>{row.original.lineItemName}</div>;
      },
    }),
    columnHelper.accessor((row) => row.bookedAmount, {
      id: "bookedAmount",
      header: () => <div>Booked Amount</div>,
      size: 180,
      enableSorting: true,
      cell: ({ getValue }) => {
        const amount = getValue();
        return <div>{amount}</div>;
      },
    }),
    columnHelper.accessor((row) => row.actualAmount, {
      id: "actualAmount",
      header: () => <div>Actual Amount</div>,
      size: 180,
      enableSorting: true,
      cell: ({ getValue }) => {
        const amount = getValue();
        return <div>{amount}</div>;
      },
    }),
    columnHelper.accessor((row) => row.adjustments, {
      id: "adjustments",
      header: () => <div>Adjustments</div>,
      size: 180,
      enableSorting: true,
      cell: ({ getValue }) => {
        const amount = getValue();
        return <div>{amount}</div>;
      },
    }),
  ];

  const table = useReactTable({
    data: lineItems ?? [],
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
        <h1 className="text-2xl w-full text-center font-bold">Line Item</h1>
        <div className="text-lg p-2 border-[1px] border-solid border-black">
          <div className="font-bold">
            Campaign Id: {table.getRowModel().rows[0]?.original.campaignId}
          </div>
          <div className="font-bold flex flex-col">
            <span>Campaign Name: </span>
            <span className="flex-1 overflow-x-auto">
              {table.getRowModel().rows[0]?.original.campaignName}
            </span>
          </div>
        </div>
        <div className="w-full">
          <button
            className="bg-black text-white hover:bg-gray-700 transition duration-100 px-4 py-2 rounded-lg cursor-pointer"
            onClick={() => {
              router.back();
            }}
          >
            {"< Back"}
          </button>
        </div>
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
                    router.push(
                      `/${row.original.campaignId}/line-item/${row.original.id}`
                    );
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
                  No Line items found
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
