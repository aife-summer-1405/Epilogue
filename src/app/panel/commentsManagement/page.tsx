"use client";

import Modal from "@/components/molecules/modal/Modal";
import {
  AlertCircleIcon,
  CommentAdd01Icon,
  Edit02Icon,
  EllipsisVerticalIcon,
  FilterIcon,
  Search02Icon,
  TrashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DateObject } from "react-multi-date-picker";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Dialog } from "@base-ui/react";
import Button from "@/components/atoms/button/Button";
import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import DropDownMenu from "@/components/molecules/dropdown/DropDownMenu";
import Badge from "@/components/atoms/badge/Badge";
import ThemedDatePicker from "@/components/molecules/themedDatePicker/ThemedDatePicker";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import useFakeLoading from "@/hooks/useFakeLoading";
import {
  ICommentFormValues,
  ISellerComment,
  RatingFilter,
  TypeFilter,
} from "./ICommentManagement";
import CommentAvatar from "./CommentAvatar";
import StarRating from "./StarRating";
import SellerCommentDetailModal from "./SellerCommentDetailModal";
import SellerCommentFormModal from "./SellerCommentFormModal";
import SellerCommentDeleteModal from "./SellerCommentDeleteModal";
import {
  buildCommentsResponse,
  currentUser,
  initialComments,
} from "./commentMock";
import {
  formatCommentDate,
  getHouseLabel,
  getRatingNumber,
  getUserFullName,
  isOwnComment,
} from "./commentUtils";

interface IFilters {
  rating: RatingFilter;
  type: TypeFilter;
  startDate: DateObject | null;
  endDate: DateObject | null;
}

interface IFormState {
  mode: "reply" | "edit";
  comment: ISellerComment;
}

interface IDropDownOption {
  label: string;
  icon: typeof AlertCircleIcon;
  onClick: () => void;
}

const ratingOptions: { value: RatingFilter; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "5", label: "5 ستاره" },
  { value: "4", label: "4 ستاره" },
  { value: "3", label: "3 ستاره" },
  { value: "2", label: "2 ستاره" },
  { value: "1", label: "1 ستاره" },
];

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "customers", label: "نظرات مشتریان" },
  { value: "mine", label: "نظرات من" },
];

const perPageOptions = [
  { value: "8", label: "8 در هر صفحه" },
  { value: "12", label: "12 در هر صفحه" },
  { value: "18", label: "18 در هر صفحه" },
];

const defaultFilters: IFilters = {
  rating: "all",
  type: "all",
  startDate: null,
  endDate: null,
};

const toMidnight = (date: DateObject) =>
  new DateObject(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

const thClass =
  "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base";
const tdClass =
  "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base";
const chipClass =
  "cursor-pointer rounded-[12px] border px-3 py-2 text-sm font-normal transition-colors";
const chipActiveClass = "border-primary-500 bg-primary-500 text-white";
const chipIdleClass =
  "border-neutral-300 text-default-text hover:bg-primary-50 dark:hover:bg-neutral-200";

const SellerCommentPage = () => {
  const router = useRouter();
  const [comments, setComments] = useState<ISellerComment[]>(initialComments);
  const [search, setSearch] = useState<string>("");
  const [whichPage, setWhichPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(8);
  const [filters, setFilters] = useState<IFilters>(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [draftRating, setDraftRating] = useState<RatingFilter>("all");
  const [draftType, setDraftType] = useState<TypeFilter>("all");
  const [draftStart, setDraftStart] = useState<DateObject | null>(null);
  const [draftEnd, setDraftEnd] = useState<DateObject | null>(null);
  const [formState, setFormState] = useState<IFormState | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const isTableLoading = useFakeLoading(whichPage);

  const response = useMemo(
    () =>
      buildCommentsResponse(comments, {
        page: whichPage,
        perPage,
        search,
        rating: filters.rating,
        type: filters.type,
        fromDate: filters.startDate ? filters.startDate.toDate() : null,
        toDate: filters.endDate ? filters.endDate.toDate() : null,
      }),
    [comments, whichPage, perPage, search, filters],
  );

  useEffect(() => {
    setWhichPage(1);
  }, [search, filters, perPage]);

  useEffect(() => {
    if (whichPage !== response.currentPage) {
      setWhichPage(response.currentPage);
    }
  }, [whichPage, response.currentPage]);

  const activeFilterCount =
    (filters.rating !== "all" ? 1 : 0) +
    (filters.type !== "all" ? 1 : 0) +
    (filters.startDate || filters.endDate ? 1 : 0);

  const openDetails = (id: string) => {
    router.push(`?commentId=${id}`, { scroll: false });
  };

  const getDropDownOptions = (comment: ISellerComment) => {
    const own = isOwnComment(comment.user, currentUser);
    const options: IDropDownOption[] = [
      {
        label: "جزئیات",
        icon: AlertCircleIcon,
        onClick: () => openDetails(comment.id),
      },
    ];

    if (own) {
      options.unshift({
        label: "ویرایش",
        icon: Edit02Icon,
        onClick: () => setFormState({ mode: "edit", comment }),
      });
      options.push({
        label: "حذف",
        icon: TrashIcon,
        onClick: () => setDeleteTargetId(comment.id),
      });
    } else if (!comment.parent_comment_id) {
      options.unshift({
        label: "پاسخ دادن",
        icon: CommentAdd01Icon,
        onClick: () => setFormState({ mode: "reply", comment }),
      });
    }

    return options;
  };

  const handleFormSubmit = ({ title, caption }: ICommentFormValues) => {
    if (!formState) return;

    if (formState.mode === "reply") {
      const parent = formState.comment;
      const reply: ISellerComment = {
        id: String(Date.now()),
        house_id: parent.house_id,
        title: "پاسخ فروشنده",
        caption,
        rating: "0",
        created_at: new Date().toISOString(),
        parent_comment_id: parent.id,
        user: currentUser,
        house: parent.house,
      };
      setComments((prev) => [reply, ...prev]);
    } else {
      const targetId = formState.comment.id;
      setComments((prev) =>
        prev.map((c) => (c.id === targetId ? { ...c, title, caption } : c)),
      );
    }

    setFormState(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;

    const target = comments.find((c) => c.id === deleteTargetId);
    if (!target || !isOwnComment(target.user, currentUser)) {
      setDeleteTargetId(null);
      return;
    }

    setComments((prev) => prev.filter((c) => c.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  const handleFilterOpenChange = (open: boolean) => {
    if (open) {
      setDraftRating(filters.rating);
      setDraftType(filters.type);
      setDraftStart(filters.startDate);
      setDraftEnd(filters.endDate);
    }
    setIsFilterOpen(open);
  };

  const applyFilters = () => {
    setFilters({
      rating: draftRating,
      type: draftType,
      startDate: draftStart,
      endDate: draftEnd,
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const handleStartDateChange = (date: DateObject | null) => {
    if (!date || Array.isArray(date)) return;

    const selected = toMidnight(date);
    setDraftStart(selected);

    if (draftEnd && draftEnd.toDate().getTime() < selected.toDate().getTime()) {
      setDraftEnd(selected);
    }
  };

  const handleEndDateChange = (date: DateObject | null) => {
    if (!date || Array.isArray(date)) return;

    const selected = toMidnight(date);
    if (
      draftStart &&
      selected.toDate().getTime() < draftStart.toDate().getTime()
    ) {
      return;
    }

    setDraftEnd(selected);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-lg font-bold text-default-text sm:text-[20px]">
          مدیریت نظرات ({response.totalCount})
        </p>
        <div className="flex w-full items-center gap-3 lg:w-auto lg:gap-4">
          <div className="flex w-full min-w-0 flex-1 items-center justify-between gap-2 rounded-[16px] border border-neutral-300 bg-default-white-bg px-4 py-2.5 lg:w-60 xl:w-100 lg:flex-none">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-base font-normal text-neutral-dark-300 outline-none placeholder:text-neutral-dark-300 dark:text-neutral-400 dark:placeholder:text-neutral-400"
              placeholder="جستجو ..."
            />
            <HugeiconsIcon
              icon={Search02Icon}
              className="size-5 shrink-0 text-neutral-dark-300 dark:text-neutral-400"
              stroke="1.5"
            />
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="shrink-0 cursor-pointer whitespace-nowrap text-sm font-normal text-primary-500"
            >
              حذف فیلترها
            </button>
          )}
          <Modal
            title="فیلتر ها"
            contentClassName="sm:max-w-2xl"
            open={isFilterOpen}
            onOpenChange={handleFilterOpenChange}
            trigger={
              <div className="relative flex shrink-0 cursor-pointer items-center gap-3 rounded-[16px] border border-neutral-300 bg-default-white-bg px-3 py-2.5">
                <HugeiconsIcon
                  icon={FilterIcon}
                  className="size-5 text-default-text"
                />
                <p className="text-base font-normal text-default-text">
                  فیلتر ها
                </p>
                {activeFilterCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
            }
            hasFooter={true}
            footer={
              <div className="flex w-full flex-col-reverse items-center justify-center gap-3 sm:flex-row sm:gap-8">
                <Dialog.Close
                  data-slot="dialog-close"
                  render={
                    <Button
                      className="w-full cursor-pointer rounded-[16px] border-neutral-dark-300 py-3 text-center text-base font-normal text-neutral-dark-300 sm:w-60 dark:border-neutral-400 dark:text-neutral-400"
                      variant="outline"
                    />
                  }
                >
                  انصراف
                </Dialog.Close>
                <Dialog.Close
                  data-slot="dialog-close"
                  render={
                    <Button
                      onClick={applyFilters}
                      className="w-full cursor-pointer rounded-[16px] text-white sm:w-60"
                    />
                  }
                >
                  اعمال فیلتر
                </Dialog.Close>
              </div>
            }
          >
            <div className="flex w-full flex-col gap-5 sm:gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-base font-semibold text-default-text">
                  امتیاز
                </p>
                <div className="flex flex-wrap gap-2">
                  {ratingOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={draftRating === option.value}
                      onClick={() => setDraftRating(option.value)}
                      className={`${chipClass} ${
                        draftRating === option.value
                          ? chipActiveClass
                          : chipIdleClass
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-base font-semibold text-default-text">
                  نوع نظر
                </p>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={draftType === option.value}
                      onClick={() => setDraftType(option.value)}
                      className={`${chipClass} ${
                        draftType === option.value
                          ? chipActiveClass
                          : chipIdleClass
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-semibold text-default-text">
                    بازه تاریخ
                  </p>
                  {(draftStart || draftEnd) && (
                    <button
                      type="button"
                      onClick={() => {
                        setDraftStart(null);
                        setDraftEnd(null);
                      }}
                      className="cursor-pointer text-sm font-normal text-primary-500"
                    >
                      حذف بازه
                    </button>
                  )}
                </div>
                <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:justify-between sm:gap-8">
                  <ThemedDatePicker
                    label="از تاریخ"
                    value={draftStart}
                    onChange={handleStartDateChange}
                  />
                  <ThemedDatePicker
                    label="تا تاریخ"
                    value={draftEnd}
                    onChange={handleEndDateChange}
                    minDate={draftStart ?? undefined}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
        <div className="max-h-130 overflow-x-auto overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-300 text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-default-white-bg">
              <tr className="text-right">
                <th className={thClass}>کاربر</th>
                <th className={thClass}>اقامتگاه</th>
                <th className={thClass}>عنوان</th>
                <th className={thClass}>متن نظر</th>
                <th className={thClass}>امتیاز</th>
                <th className={thClass}>تاریخ</th>
                <th className={thClass}>نوع</th>
                <th className={`${thClass} text-left`}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isTableLoading ? (
                Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="border-t border-neutral-300">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-8 shrink-0 rounded-full" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-48" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-7 w-24 rounded-[8px]" />
                    </td>
                    <td className="py-3 pl-3">
                      <Skeleton className="mr-auto size-6 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : response.comments.length === 0 ? (
                <tr className="border-t border-neutral-300">
                  <td
                    colSpan={8}
                    className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                  >
                    نظری یافت نشد
                  </td>
                </tr>
              ) : (
                response.comments.map((comment) => {
                  const own = isOwnComment(comment.user, currentUser);

                  return (
                    <tr
                      key={comment.id}
                      className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                    >
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-3">
                          <CommentAvatar user={comment.user} />
                          <span className="whitespace-nowrap text-sm font-normal text-default-text sm:text-base">
                            {getUserFullName(comment.user)}
                          </span>
                        </div>
                      </td>
                      <td className={tdClass}>
                        {getHouseLabel(comment.house)}
                      </td>
                      <td className={tdClass}>{comment.title}</td>
                      <td className="max-w-48 py-3 pl-4 sm:max-w-72 lg:max-w-96">
                        <span
                          title={comment.caption}
                          className="block truncate text-sm font-normal text-default-text sm:text-base"
                        >
                          {comment.caption}
                        </span>
                      </td>
                      <td className="py-3">
                        {comment.parent_comment_id ? (
                          <span className="text-sm text-neutral-dark-300 dark:text-neutral-400">
                            —
                          </span>
                        ) : (
                          <StarRating value={getRatingNumber(comment.rating)} />
                        )}
                      </td>
                      <td className={tdClass}>
                        {formatCommentDate(comment.created_at)}
                      </td>
                      <td className="py-3">
                        {own ? (
                          <Badge text={"نظر شما"} type={"success"} />
                        ) : (
                          <span className="whitespace-nowrap text-sm font-normal text-default-text sm:text-base">
                            {comment.parent_comment_id
                              ? "پاسخ کاربر"
                              : "نظر مشتری"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 pl-3">
                        <div className="flex justify-end">
                          <DropDownMenu
                            triggerRender={
                              <HugeiconsIcon
                                icon={EllipsisVerticalIcon}
                                className="size-5 cursor-pointer text-default-black sm:size-6"
                              />
                            }
                            dropDownItems={getDropDownOptions(comment)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 sm:mx-0">
            <Pagination
              currentPage={response.currentPage}
              onPageChange={(event) => setWhichPage(event)}
              totalPages={response.totalPages}
              siblingCount={0}
              containerClassName="w-fit! bg-transparent! gap-1! sm:gap-2!"
              itemClassName="cursor-pointer! size-7! rounded-full! flex! items-center! justify-center!"
              buttonsClassName="cursor-pointer! rounded-full! flex! items-center! justify-center! p-0 mx-1! sm:mx-2! size-7"
            />
          </div>
          <div className="hidden shrink-0 sm:block">
            <SelectComponent
              items={perPageOptions}
              placeHolder={"تعداد نمایش"}
              onChange={(value: string | null) =>
                value ? setPerPage(Number(value)) : setPerPage(1)
              }
              triggerClassName="bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto!"
            />
          </div>
        </div>
      </div>

      <Suspense>
        <SellerCommentDetailModal
          comments={comments}
          currentUser={currentUser}
          onReply={(comment) => setFormState({ mode: "reply", comment })}
          onEdit={(comment) => setFormState({ mode: "edit", comment })}
          onDelete={(id) => setDeleteTargetId(id)}
        />
      </Suspense>
      <SellerCommentFormModal
        mode={formState?.mode ?? "reply"}
        comment={formState?.comment ?? null}
        onClose={() => setFormState(null)}
        onSubmit={handleFormSubmit}
      />
      <SellerCommentDeleteModal
        open={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default SellerCommentPage;
