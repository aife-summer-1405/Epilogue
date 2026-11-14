"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  StarIcon, 
  UserAccountIcon, 
  Award01Icon, 
  MessageQuestionIcon 
} from "@hugeicons/core-free-icons";
import { 
  useGivenFeedbacks, 
  useReceivedFeedbacks, 
  useLoyalty 
} from "@/hooks/queries/useFeedback";

interface UserFeedbackPanelProps {
  userRole: "buyer" | "seller";
}

export default function UserFeedbackPanel({ userRole }: UserFeedbackPanelProps) {
  const [currentUserId, setCurrentUserId] = useState<string>("362");
  const [activeTab, setActiveTab] = useState<"received" | "given">("received");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("user_id");
      if (storedId) {
        setCurrentUserId(storedId);
      }
    }
  }, []);

  const { data: receivedData, isLoading: isReceivedLoading } = useReceivedFeedbacks(currentUserId, activeTab === "received");
  const { data: givenData, isLoading: isGivenLoading } = useGivenFeedbacks(currentUserId, activeTab === "given");
  const { data: loyaltyData, isLoading: isLoyaltyLoading } = useLoyalty(currentUserId);

  const activeData = activeTab === "received" ? receivedData : givenData;
  const isLoading = activeTab === "received" ? isReceivedLoading : isGivenLoading;

  const feedbacks = activeData?.feedbacks || [];
  const totalPoints = loyaltyData?.totalPoints ?? activeData?.totalPoints ?? 0;

  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6">
      
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
              <HugeiconsIcon icon={Award01Icon} size={32} className="text-warning-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">باشگاه مشتریان و امتیاز وفاداری</h3>
              <p className="text-xs text-primary-100 mt-1">
                {userRole === "buyer" ? "امتیاز کسب‌شده از رزروها و نظرات شما" : "امتیاز وفاداری شما به عنوان میزبان"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md">
            <div>
              <span className="block text-[10px] text-primary-200">امتیاز کل شما</span>
              <span className="text-2xl font-black text-warning-300">
                {isLoyaltyLoading ? "..." : totalPoints} امتیاز
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-border bg-card p-6 shadow-xs">
        
        {/* هدر و تب‌ها */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h3 className="text-base font-bold text-foreground">
              {userRole === "buyer" ? "نظرات و فیدبک‌های خریدار" : "نظرات و فیدبک‌های میزبان"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              مدیریت و مشاهده نظرات ارسالی و دریافتی حساب کاربری شما
            </p>
          </div>

          <div className="flex rounded-xl bg-muted p-1">
            <button
              onClick={() => setActiveTab("received")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "received"
                  ? "bg-card text-primary-600 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              دریافت شده 
            </button>
            <button
              onClick={() => setActiveTab("given")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "given"
                  ? "bg-card text-primary-600 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ارسال شده
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">در حال دریافت فیدبک‌ها...</div>
          ) : feedbacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 rounded-full bg-muted p-4 text-muted-foreground">
                <HugeiconsIcon icon={MessageQuestionIcon} size={28} />
              </div>
              <p className="text-sm font-semibold text-foreground">هیچ فیدبکی موجود نیست</p>
              <p className="text-xs text-muted-foreground mt-1">در این تب موردی برای نمایش وجود ندارد.</p>
            </div>
          ) : (
            feedbacks.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl bg-muted/40 p-4 border border-border transition-all hover:border-border/80"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                      <HugeiconsIcon icon={UserAccountIcon} size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        شناسه ملک: {item.houseId}
                      </h4>
                      <span className="text-[11px] text-muted-foreground">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString("fa-IR") : "تاریخ ثبت نشده"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.pointsAwarded > 0 && (
                      <span className="rounded-xl bg-success-50 dark:bg-success-900/30 px-3 py-1 text-success-700 dark:text-success-300 text-xs font-bold">
                        +{item.pointsAwarded} امتیاز پاداش
                      </span>
                    )}

                    <div className="flex items-center gap-1 rounded-xl bg-warning-50 dark:bg-warning-900/30 px-3 py-1 text-warning-700 dark:text-warning-300 text-xs font-bold">
                      <span>{item.rating}</span>
                      <HugeiconsIcon icon={StarIcon} size={16} className="fill-warning-500 text-warning-500" />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed pr-13">
                  {item.comment}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}