"use client";

import React, { useState } from "react";
import BuyerPersonalInfoForm from "./BuyerPersonalInfoForm";
import BuyerSecurityForm from "./BuyerSecurityForm";
import { useGetBuyerProfile } from "@/hooks/queries/panel/buyer/useGetBuyerProfile";

type ActiveTab = "personal" | "security";

interface BuyerProfileContainerProps {
  userId?: string;
}

const BuyerProfileContainer: React.FC<BuyerProfileContainerProps> = ({
  userId,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("personal");
  const { data, isLoading } = useGetBuyerProfile(userId);

  return (
    <section
      className="flex min-h-170 w-full flex-col rounded-[32px] border border-gray-200/80 bg-[#f6f6f6] p-5 shadow-xs sm:p-8 lg:p-10 dark:border-zinc-800 dark:bg-[#272727]"
      dir="rtl"
    >
      <div className="flex w-full flex-col items-start gap-6">
        <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl dark:text-white">
          اطلاعات کاربری
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`rounded-2xl border px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === "personal"
                ? "border-[#0f2d59] bg-white text-[#0f2d59] shadow-xs dark:border-blue-400 dark:bg-[#1e1e1e] dark:text-blue-400"
                : "border-gray-300 bg-transparent text-gray-500 hover:border-gray-400 dark:border-zinc-700 dark:text-gray-400"
            }`}
          >
            اطلاعات شخصی
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`rounded-2xl border px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === "security"
                ? "border-[#0f2d59] bg-white text-[#0f2d59] shadow-xs dark:border-blue-400 dark:bg-[#1e1e1e] dark:text-blue-400"
                : "border-gray-300 bg-transparent text-gray-500 hover:border-gray-400 dark:border-zinc-700 dark:text-gray-400"
            }`}
          >
            اطلاعات امنیتی
          </button>
        </div>
      </div>

      {activeTab === "personal" ? (
        isLoading ? (
          <div className="mt-10 flex w-full flex-col items-center gap-8">
            <div className="h-36 w-36 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-800" />
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-800"
                />
              ))}
            </div>
          </div>
        ) : (
          <BuyerPersonalInfoForm user={data?.user} />
        )
      ) : (
        <BuyerSecurityForm />
      )}
    </section>
  );
};

export default BuyerProfileContainer;