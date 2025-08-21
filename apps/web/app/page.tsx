"use client";

import { useFetchCampaign } from "@/lib/hooks/campaign/useFetchCampaign";
import { useFetchLineItems } from "@/lib/hooks/lineItem/useFetchLineItems";

export default function Home() {
  const { data: campaigns } = useFetchCampaign();
  const { data: lineItems } = useFetchLineItems(1);

  console.log("Campaigns", campaigns);
  console.log("line Items", lineItems);
  return (
    <div className="">
      <main className="text-red-500">aaa</main>
    </div>
  );
}
