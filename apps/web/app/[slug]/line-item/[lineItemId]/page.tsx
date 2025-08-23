"use client";

import { use, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useFetchLineItems } from "@/lib/hooks/lineItem/useFetchLineItems";
import ApiClient from "@/lib/api";
import DetailElement from "@/components/DetailElement";
import BackBtn from "@/components/BackBtn";

export default function LineItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string; lineItemId: string }>;
}) {
  const { slug, lineItemId } = use(params);

  const router = useRouter();

  if (isNaN(Number(slug)) || isNaN(Number(lineItemId))) {
    router.push("/");
  }

  // Get specific line item from the provided campaign id
  const {
    data: lineItem,
    isLoading,
    refetch,
  } = useFetchLineItems(Number(slug), Number(lineItemId));

  // Edit adjustment
  const [isEditing, setIsEditing] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [adjustments, setAdjustments] = useState("");

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const adjustments = (event.target as HTMLFormElement).adjustments.value;

      // Check valid number
      if (
        !isNaN(Number(adjustments)) &&
        adjustments !== lineItem?.[0]?.adjustments
      ) {
        // edit adjustment value
        setIsModifying(true);
        await ApiClient.lineItem.updateAdjustments.mutation({
          body: {
            id: Number(lineItemId),
            adjustments: Number(adjustments),
          },
        });
        setIsModifying(false);

        // Update the data to be the latest
        await refetch();
      }

      setIsEditing(false);
    },
    [lineItem, lineItemId, refetch]
  );

  return (
    <section className="w-full p-16">
      <h1 className="w-full text-2xl font-bold text-center mb-4">
        Line Item Detail
      </h1>
      <div className="w-full mb-4">
        <BackBtn
          onClick={() => {
            router.back();
          }}
        />
      </div>
      {isLoading ? (
        <div className="w-full h-24">Loading...</div>
      ) : lineItem && lineItem?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 p-4 border-[1px] border-solid border-black gap-2">
          <DetailElement title="Line item id" element={lineItemId} />
          <DetailElement
            title="Line item name"
            element={lineItem[0]?.lineItemName || ""}
          />
          <DetailElement
            title="Booked amount"
            element={lineItem[0]?.bookedAmount.toString() || ""}
          />
          <DetailElement
            title="Actual amount"
            element={lineItem[0]?.actualAmount.toString() || ""}
          />
          {isEditing ? (
            <form
              onSubmit={onSubmit}
              className="flex w-full gap-x-2 items-center text-base py-2 px-4 h-10"
            >
              <label className="font-bold">Adjustments:</label>
              <input
                name="adjustments"
                value={adjustments}
                onChange={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  setAdjustments(value);
                }}
                className="px-2 py-1 border-[1px] border-solid border-black rounded-sm"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-red-500 text-white hover:bg-red-300 rounded-sm cursor-pointer w-16 h-8"
                disabled={isModifying}
              >
                {isModifying ? (
                  <img
                    src="/Icon/svg/spinner.svg"
                    loading="lazy"
                    className="animate-spin mx-auto"
                  />
                ) : (
                  "Send"
                )}
              </button>
            </form>
          ) : (
            <div
              className="text-base py-2 px-4 flex gap-x-2 h-10 cursor-pointer rounded-lg hover:border-[1px] hover:border-gray-200 hover:shadow-2xl hover:-translate-y-0.5"
              onClick={() => {
                setAdjustments(lineItem[0]?.adjustments.toString() ?? "");
                setIsEditing(true);
              }}
            >
              <span className="font-bold">Adjustments:</span>
              <span>{lineItem[0]?.adjustments}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-24">No line item found</div>
      )}
    </section>
  );
}
