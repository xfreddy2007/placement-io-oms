import contract from "@/rest-contract/campaign";
import RouterServer from "../router-server";
import { fetchCampaign } from "./functions/fetchCampaign";

export default RouterServer.router(contract, {
  getCampaign: async ({ query }) => {
    const { id } = query;

    const campaigns = await fetchCampaign(id);

    if (!campaigns || campaigns.length === 0) {
      return {
        status: 204,
        body: { message: "No campaign found" },
      };
    }

    return {
      status: 200,
      body: {
        campaigns,
      },
    };
  },
});
