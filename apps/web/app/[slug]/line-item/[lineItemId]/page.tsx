"use client";

import { use, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LineItemDetailPage({
  params,
}: {
  params: Promise<{ lineItemId: string }>;
}) {
  const { lineItemId } = use(params);

  const router = useRouter();

  if (isNaN(Number(lineItemId))) {
    router.push("/");
  }

  // Edit adjustment
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = useCallback((event: FormEvent) => {
    const adjustments = (event.target as HTMLFormElement).adjustments.value;

    // Check valid number
    if (!isNaN(Number(adjustments))) {
      // edit adjustment value
    }

    setIsEditing(false);
  }, []);

  return (
    <section className="w-full p-16">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center mb-4">
          Line Item Detail
        </h1>
      </div>
      <div className="w-full mb-4">
        <button
          className="bg-black text-white hover:bg-gray-700 transition duration-100 px-4 py-2 rounded-lg cursor-pointer"
          onClick={() => {
            router.back();
          }}
        >
          {"< Back"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 p-4 border-[1px] border-solid border-black gap-2">
        <div className="text-base py-2 px-4 flex gap-x-2 h-10">
          <span className="font-bold">Line item id:</span>
          <span>{lineItemId}</span>
        </div>
        <div className="text-base py-2 px-4 flex gap-x-2 h-10">
          <span className="font-bold">Line item name:</span>
        </div>
        <div className="text-base py-2 px-4 flex gap-x-2 h-10">
          <span className="font-bold">Booked amount:</span>
        </div>
        <div className="text-base py-2 px-4 flex gap-x-2 h-10">
          <span className="font-bold">Actual amount:</span>
        </div>
        <div className="text-base py-2 px-4 flex gap-x-2 h-10">
          {isEditing ? (
            <form
              onSubmit={onSubmit}
              className="flex w-full gap-x-2 items-center"
            >
              <label className="font-bold">Adjustments</label>
              <input
                name="adjustments"
                className="px-2 py-1 border-[1px] border-solid border-black rounded-sm"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-red-500 text-white hover:bg-red-300 rounded-sm cursor-pointer"
              >
                Send
              </button>
            </form>
          ) : (
            <span
              className="font-bold cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              Adjustments:
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
