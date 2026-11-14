"use client";

import UserFeedbackPanel from "@/components/templates/UserFeedbackPanel";

export default function BuyerFeedbackPage() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-[#181818] py-8">
      <div className="mx-auto max-w-5xl px-4 mb-6">
        <h1 className="text-xl font-extrabold text-neutral-900 dark:text-white">
          داشبورد فیدبک‌ها و امتیازات خریدار
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          مشاهده نظرات ثبت‌شده، فیدبک‌های دریافتی و باشگاه مشتریان
        </p>
      </div>
      
      <UserFeedbackPanel userRole="buyer" />
    </main>
  );
}