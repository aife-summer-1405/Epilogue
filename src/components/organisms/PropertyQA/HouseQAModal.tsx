"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Cancel01Icon, 
  HelpSquareIcon, 
  SendIcon, 
  UserCircleIcon, 
  StoreIcon 
} from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import { usePropertyQAMutations, usePropertyQAs } from "@/hooks/usePropertyQA";

interface HouseQAModalProps {
  houseId: number | string;
  isOpen: boolean;
  onClose: () => void;
  isSeller?: boolean;
}

export default function HouseQAModal({ houseId, isOpen, onClose, isSeller = false }: HouseQAModalProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | number | null>(null);

  const { data: qaList, isLoading } = usePropertyQAs(houseId, isOpen);
  const { questionMutation, answerMutation } = usePropertyQAMutations(houseId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div
        dir="rtl"
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-[28px] bg-white dark:bg-[#1E1E1E] border border-neutral-100 dark:border-neutral-800 p-6 shadow-2xl transition-all"
      >
        {/* هدر مودال */}
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <HugeiconsIcon icon={HelpSquareIcon} size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                پرسش و پاسخ درباره اقامتگاه
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {isSeller ? "به سوالات کاربران و مهمانان پاسخ دهید" : "سوال خود را از میزبان بپرسید"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        </div>

        {/* لیست پیام‌ها */}
        <div className="my-4 flex-1 overflow-y-auto space-y-4 pr-1 pl-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-xs text-neutral-400">در حال دریافت گفتگوها...</p>
            </div>
          ) : !qaList || qaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 rounded-full bg-neutral-100 dark:bg-neutral-800 p-4 text-neutral-400">
                <HugeiconsIcon icon={HelpSquareIcon} size={32} />
              </div>
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">هنوز پرسشی ثبت نشده است</p>
              <p className="text-xs text-neutral-400 mt-1">اولین نفری باشید که از میزبان سوال می‌پرسد.</p>
            </div>
          ) : (
            qaList.map((item: any) => (
              <div
                key={item.id}
                className="group flex flex-col gap-3 rounded-2xl bg-neutral-50/80 dark:bg-[#252525] p-4 border border-neutral-100 dark:border-neutral-800 transition-all hover:border-neutral-200 dark:hover:border-neutral-700 shadow-xs"
              >
                {/* بخش سوال */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-blue-600 dark:text-blue-400 shrink-0">
                    <HugeiconsIcon icon={UserCircleIcon} size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 block mb-1">پرسش مهمان</span>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                      {item.question}
                    </p>
                  </div>
                </div>

                {/* بخش پاسخ */}
                {item.answer ? (
                  <div className="mr-8 mt-2 flex items-start gap-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 p-3.5 border border-blue-100/50 dark:border-blue-900/30">
                    <div className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <HugeiconsIcon icon={StoreIcon} size={18} />
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 block mb-1">پاسخ میزبان</span>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                ) : (
                  isSeller && (
                    <div className="mr-8 mt-2">
                      {activeReplyId === item.id ? (
                        <div className="flex gap-2 animate-fade-in">
                          <input
                            type="text"
                            placeholder="پاسخ خود را بنویسید..."
                            value={replyText[item.id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [item.id]: e.target.value })}
                            className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1E1E1E] px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-blue-600 transition-colors shadow-xs"
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              if (replyText[item.id]?.trim()) {
                                answerMutation.mutate({ questionId: item.id, answer: replyText[item.id] });
                              }
                            }}
                            disabled={answerMutation.isPending}
                            className="rounded-xl px-4"
                          >
                            {answerMutation.isPending ? "در حال ثبت..." : "ارسال پاسخ"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveReplyId(null)}
                            className="rounded-xl px-3"
                          >
                            انصراف
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveReplyId(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                        >
                          پاسخ به این پرسش
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            ))
          )}
        </div>

        {/* بخش ثبت سوال جدید (فقط برای خریدار) */}
        {!isSeller && (
          <div className="mt-2 border-t border-neutral-100 dark:border-neutral-800 pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="سوال خود درباره اقامتگاه را بپرسید..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newQuestion.trim()) {
                    questionMutation.mutate(newQuestion);
                    setNewQuestion("");
                  }
                }}
                className="flex-1 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-[#252525] px-4 py-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-600 transition-colors"
              />
              <Button
                size="md"
                onClick={() => {
                  if (newQuestion.trim()) {
                    questionMutation.mutate(newQuestion);
                    setNewQuestion("");
                  }
                }}
                disabled={questionMutation.isPending || !newQuestion.trim()}
                className="flex items-center gap-2 rounded-2xl px-6 font-semibold"
              >
                <span>{questionMutation.isPending ? "در حال ارسال..." : "ارسال"}</span>
                <HugeiconsIcon icon={SendIcon} size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}