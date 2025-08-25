import contract from "@placement-io-oms/database/rest-contract/reporting";
import RouterServer from "../router-server";
import { generateCampaignReport } from "./functions/generateCampaignReport";

const router = RouterServer.router(contract, {
  getCampaignReport: async ({ query }) => {
    const { campaignId } = query;

    const reportData = await generateCampaignReport(campaignId);

    if (!reportData.reports || reportData.reports.length === 0) {
      return {
        status: 204,
        body: { message: "No campaign data found for reporting" },
      };
    }

    return {
      status: 200,
      body: reportData,
    };
  },
});

export default router;
