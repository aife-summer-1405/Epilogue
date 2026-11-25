
"use client";

import { useState } from "react";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  Cancel01Icon,
  HelpSquareIcon,
  SendIcon,
  UserCircleIcon,
  StoreIcon,
} from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";

import {
  usePropertyQAMutations,
  usePropertyQAs,
  useCanAnswerPropertyQA,
} from "@/hooks/usePropertyQA";

import { checkAuthAndExecute } from "@/utils/authGuard";

interface HouseQAModalProps {
  houseId: number | string;
  isOpen: boolean;
  onClose: () => void;
}

export default function HouseQAModal({
  houseId,
  isOpen,
  onClose,
}: HouseQAModalProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | number | null>(
    null
  );

  const { data: qaList, isLoading } = usePropertyQAs(houseId, isOpen);

  const { data: canAnswer = false } = useCanAnswerPropertyQA(isOpen);

  const { questionMutation, answerMutation } =
    usePropertyQAMutations(houseId);

  const handleSendQuestion = () => {
    checkAuthAndExecute(async () => {
      if (!newQuestion.trim()) return;

      questionMutation.mutate(newQuestion.trim(), {
        onSuccess: () => {
          setNewQuestion("");
        },
      });
    });
  };

  const handleSendAnswer = (itemId: string | number) => {
    const key = String(itemId);

    checkAuthAndExecute(async () => {
      const value = replyText[key]?.trim();

      if (!value) return;

      answerMutation.mutate(
        {
          questionId: itemId,
          answer: value,
        },
        {
          onSuccess: () => {
            setReplyText((prev) => ({
              ...prev,
              [key]: "",
            }));

            setActiveReplyId(null);
          },

          onError: (err) => {
            console.error("خطا در ارسال پاسخ:", err);
          },
        }
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div
        dir="rtl"
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-[28px] border border-neutral-100 bg-white p-6 shadow-2xl transition-all dark:border-neutral-800 dark:bg-[#1E1E1E]"
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <HugeiconsIcon icon={HelpSquareIcon} size={24} />
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                پرسش و پاسخ درباره اقامتگاه
              </h3>

              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {canAnswer
                  ? "به سوالات کاربران و مهمانان پاسخ دهید"
                  : "سوال خود را از میزبان بپرسید"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        </div>

        <div className="my-4 flex-1 space-y-4 overflow-y-auto pr-1 pl-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

              <p className="text-xs text-neutral-400">
                در حال دریافت گفتگوها...
              </p>
            </div>
          ) : !qaList || qaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 rounded-full bg-neutral-100 p-4 text-neutral-400 dark:bg-neutral-800">
                <HugeiconsIcon icon={HelpSquareIcon} size={32} />
              </div>

              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                هنوز پرسشی ثبت نشده است
              </p>

              <p className="mt-1 text-xs text-neutral-400">
                اولین نفری باشید که از میزبان سوال می‌پرسد.
              </p>
            </div>
          ) : (
            qaList.map((item: any) => {
              const itemKey = String(item.id);

              return (
                <div
                  key={item.id}
                  className="group flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4 shadow-xs transition-all hover:border-neutral-200 dark:border-neutral-800 dark:bg-[#252525] dark:hover:border-neutral-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
                      <HugeiconsIcon icon={UserCircleIcon} size={20} />
                    </div>

                    <div className="flex-1">
                      <span className="mb-1 block text-[11px] font-medium text-blue-600 dark:text-blue-400">
                        پرسش مهمان
                      </span>

                      <p className="text-sm font-medium leading-relaxed text-neutral-800 dark:text-neutral-200">
                        {item.question}
                      </p>
                    </div>
                  </div>

                  {item.answer && (
                    <div className="mt-2 mr-8 flex items-start gap-3 rounded-xl border border-blue-100/50 bg-blue-50/50 p-3.5 dark:border-blue-900/30 dark:bg-blue-950/20">
                      <div className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">
                        <HugeiconsIcon icon={StoreIcon} size={18} />
                      </div>

                      <div className="flex-1">
                        <span className="mb-1 block text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          پاسخ میزبان
                        </span>

                        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}

                  {canAnswer && (
                    <div className="mt-2 mr-8">
                      {activeReplyId === item.id ? (
                        <div className="flex gap-2 animate-fade-in">
                          <input
                            type="text"
                            placeholder="پاسخ خود را بنویسید..."
                            value={replyText[itemKey] || ""}
                            onChange={(e) =>
                              setReplyText((prev) => ({
                                ...prev,
                                [itemKey]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSendAnswer(item.id);
                              }
                            }}
                            className="flex-1 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 shadow-xs outline-none transition-colors focus:border-blue-600 dark:border-neutral-700 dark:bg-[#1E1E1E] dark:text-white"
                          />

                          <Button
                            size="sm"
                            onClick={() => handleSendAnswer(item.id)}
                            disabled={
                              answerMutation.isPending ||
                              !replyText[itemKey]?.trim()
                            }
                            className="rounded-xl px-4"
                          >
                            {answerMutation.isPending
                              ? "در حال ثبت..."
                              : "ارسال پاسخ"}
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
                          type="button"
                          onClick={() => {
                            setReplyText((prev) => ({
                              ...prev,
                              [itemKey]: prev[itemKey] ?? item.answer ?? "",
                            }));

                            setActiveReplyId(item.id);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
                        >
                          {item.answer
                            ? "ویرایش پاسخ"
                            : "پاسخ به این پرسش"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {!canAnswer && (
          <div className="mt-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="سوال خود درباره اقامتگاه را بپرسید..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendQuestion();
                  }
                }}
                className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-blue-600 dark:border-neutral-700 dark:bg-[#252525] dark:text-white"
              />

              <Button
                size="md"
                onClick={handleSendQuestion}
                disabled={
                  questionMutation.isPending || !newQuestion.trim()
                }
                className="flex items-center gap-2 rounded-2xl px-6 font-semibold"
              >
                <span>
                  {questionMutation.isPending
                    ? "در حال ارسال..."
                    : "ارسال"}
                </span>

                <HugeiconsIcon icon={SendIcon} size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
