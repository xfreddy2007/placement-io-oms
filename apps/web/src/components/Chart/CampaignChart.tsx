import { CampaignReport } from "@placement-io-oms/database/rest-contract/reporting";

interface CampaignChartProps {
  reports: CampaignReport[];
}

const CampaignChart = ({ reports }: CampaignChartProps) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Chart
        </h3>
        <p className="text-gray-500">No data available for chart</p>
      </div>
    );
  }

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...reports.flatMap((report) => [
      report.totalBookedAmount,
      report.totalActualAmount,
    ])
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Campaign Performance Comparison
      </h3>

      <div className="space-y-4">
        {reports.map((report) => {
          const bookedPercentage = (report.totalBookedAmount / maxValue) * 100;
          const actualPercentage = (report.totalActualAmount / maxValue) * 100;

          return (
            <div key={report.campaignId} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {report.campaignName}
                </span>
                <div className="flex space-x-4 text-xs text-gray-500">
                  <span>
                    Booked: ${report.totalBookedAmount.toLocaleString()}
                  </span>
                  <span>
                    Actual: ${report.totalActualAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
                {/* Booked Amount Bar */}
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                  style={{ width: `${bookedPercentage}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white px-2">
                      Booked
                    </span>
                  </div>
                </div>

                {/* Actual Amount Bar */}
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 rounded"
                  style={{ width: `${actualPercentage}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white px-2">
                      Actual
                    </span>
                  </div>
                </div>
              </div>

              {/* Variance indicator */}
              <div className="flex justify-between text-xs">
                <span
                  className={`font-medium ${
                    report.variance > 0
                      ? "text-red-600"
                      : report.variance < 0
                        ? "text-green-600"
                        : "text-gray-600"
                  }`}
                >
                  Variance: ${report.variance.toLocaleString()} (
                  {report.variancePercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Booked Amount</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Actual Amount</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignChart;
