import contract from "@placement-io-oms/database/rest-contract";
import { initQueryClient } from "@ts-rest/react-query";

const ApiClient = initQueryClient(contract, {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8080",
  baseHeaders: {},
});

export default ApiClient;
