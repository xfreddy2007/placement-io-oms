"use client";

import { useState } from "react";
import { useCampaignReport } from "@/lib/hooks/reporting/useCampaignReport";
import { useFetchCampaign } from "@/lib/hooks/campaign/useFetchCampaign";
import {
  ColumnDef,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CampaignReport } from "@placement-io-oms/database/rest-contract/reporting";
import CampaignChart from "@/components/Chart/CampaignChart";

// Utility function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Utility function to format percentage
const formatPercentage = (percentage: number) => {
  return `${percentage.toFixed(2)}%`;
};

// Utility function to get variance color
const getVarianceColor = (variance: number) => {
  if (variance > 0) return "text-red-600"; // Over budget
  if (variance < 0) return "text-green-600"; // Under budget
  return "text-gray-600"; // On budget
};

export default function ReportingPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<
    number | undefined
  >();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "campaignName", desc: false },
  ]);

  // Fetch data
  const { data: campaigns } = useFetchCampaign();
  const { data: reportData, isLoading } = useCampaignReport(selectedCampaignId);

  // Column helper for campaign reports table
  const columnHelper = createColumnHelper<CampaignReport>();

  const columns: ColumnDef<CampaignReport, any>[] = [
    columnHelper.accessor((row) => row.campaignId, {
      id: "campaignId",
      header: () => <div className="font-semibold">Campaign ID</div>,
      cell: ({ row }) => (
        <div className="font-mono">{row.original.campaignId}</div>
      ),
    }),
    columnHelper.accessor((row) => row.campaignName, {
      id: "campaignName",
      header: () => <div className="font-semibold">Campaign Name</div>,
      cell: ({ row }) => (
        <div className="max-w-xs truncate">{row.original.campaignName}</div>
      ),
    }),
    columnHelper.accessor((row) => row.totalBookedAmount, {
      id: "totalBookedAmount",
      header: () => <div className="font-semibold">Booked Amount</div>,
      cell: ({ row }) => (
        <div className="font-mono">
          {formatCurrency(row.original.totalBookedAmount)}
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.totalActualAmount, {
      id: "totalActualAmount",
      header: () => <div className="font-semibold">Actual Amount</div>,
      cell: ({ row }) => (
        <div className="font-mono">
          {formatCurrency(row.original.totalActualAmount)}
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.totalAdjustments, {
      id: "totalAdjustments",
      header: () => <div className="font-semibold">Adjustments</div>,
      cell: ({ row }) => (
        <div
          className={`font-mono ${row.original.totalAdjustments >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {formatCurrency(row.original.totalAdjustments)}
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.variance, {
      id: "variance",
      header: () => <div className="font-semibold">Variance</div>,
      cell: ({ row }) => (
        <div className={`font-mono ${getVarianceColor(row.original.variance)}`}>
          {formatCurrency(row.original.variance)}
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.variancePercentage, {
      id: "variancePercentage",
      header: () => <div className="font-semibold">Variance %</div>,
      cell: ({ row }) => (
        <div
          className={`font-mono ${getVarianceColor(row.original.variancePercentage)}`}
        >
          {formatPercentage(row.original.variancePercentage)}
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.lineItemCount, {
      id: "lineItemCount",
      header: () => <div className="font-semibold">Line Items</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.lineItemCount}</div>
      ),
    }),
  ];

  const table = useReactTable({
    data: reportData?.reports ?? [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Campaign Performance Report
          </h1>
          <p className="text-gray-600">Booked vs Actual Amount Analysis</p>
        </div>

        {/* Campaign Filter */}
        <div className="mb-6">
          <label
            htmlFor="campaign-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter by Campaign
          </label>
          <select
            id="campaign-select"
            value={selectedCampaignId || ""}
            onChange={(e) =>
              setSelectedCampaignId(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Campaigns</option>
            {campaigns?.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        {reportData?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Campaigns
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {reportData.summary.totalCampaigns}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Booked
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(reportData.summary.totalBookedAmount)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Actual
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(reportData.summary.totalActualAmount)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Variance
              </h3>
              <p
                className={`text-3xl font-bold ${getVarianceColor(reportData.summary.totalVariance)}`}
              >
                {formatCurrency(reportData.summary.totalVariance)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Avg Variance %
              </h3>
              <p
                className={`text-3xl font-bold ${getVarianceColor(reportData.summary.averageVariancePercentage)}`}
              >
                {formatPercentage(reportData.summary.averageVariancePercentage)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Adjustments
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {formatCurrency(reportData.summary.totalAdjustments)}
              </p>
            </div>
          </div>
        )}

        {/* Performance Chart */}
        <div className="mb-8">
          <CampaignChart reports={reportData?.reports ?? []} />
        </div>

        {/* Campaign Reports Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Campaign Performance Details
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center space-x-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() && (
                            <span>
                              {header.column.getIsSorted() === "asc"
                                ? "↑"
                                : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Line Item Details (if a specific campaign is selected) */}
        {selectedCampaignId &&
          reportData?.reports.length === 1 &&
          reportData.reports[0] && (
            <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Line Item Details - {reportData.reports[0].campaignName}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Line Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booked Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actual Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Adjustments
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variance %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.reports[0]?.lineItems.map((lineItem) => (
                      <tr key={lineItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lineItem.lineItemName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {formatCurrency(lineItem.bookedAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {formatCurrency(lineItem.actualAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-green-600">
                          {formatCurrency(lineItem.adjustments)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          <span className={getVarianceColor(lineItem.variance)}>
                            {formatCurrency(lineItem.variance)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          <span
                            className={getVarianceColor(
                              lineItem.variancePercentage
                            )}
                          >
                            {formatPercentage(lineItem.variancePercentage)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
