import contract from "@placement-io-oms/database/rest-contract/lineItem";
import RouterServer from "../router-server";
import { fetchLineItems } from "./functions/fetchLineItems";
import { updateLineItem } from "./functions/updateLineItem";

export default RouterServer.router(contract, {
  getLineItem: async ({ query }) => {
    const { campaignId, id } = query;

    const lineItems = await fetchLineItems(campaignId, id);

    if (!lineItems || lineItems.length === 0) {
      return {
        status: 204,
        body: { message: `No line items found for the campaign ${campaignId}` },
      };
    }

    return {
      status: 200,
      body: {
        lineItems,
      },
    };
  },
  updateAdjustments: async ({ body }) => {
    const { id, adjustments } = body;

    const lineItem = await updateLineItem(id, adjustments);

    if (!lineItem) {
      return {
        status: 204,
        body: { message: "Adjustment update failed." },
      };
    }
    return {
      status: 201,
      body: {
        lineItem,
      },
    };
  },
});
