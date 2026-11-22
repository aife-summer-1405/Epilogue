"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Edit02Icon,
  EllipsisVerticalIcon,
  FilterIcon,
  Search02Icon,
  StarIcon,
  TrashIcon,
} from "@hugeicons/core-free-icons";
import Modal from "@/components/molecules/modal/Modal";
import Button from "@/components/atoms/button/Button";
import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import DropDownMenu from "@/components/molecules/dropdown/DropDownMenu";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import { Skeleton } from "@/components/ui/skeleton";
import { IAdminComment } from "@/core/types/admin/adminComments.types";
import { useGetAdminComments } from "@/hooks/queries/useGetAdminComments";
import {
  useDeleteAdminComment,
  useUpdateAdminComment,
} from "@/hooks/mutations/panel/admin/useAdminCommentMutations";
import AdminCommentDetailModal from "./AdminCommentDetailModal";
import AdminCommentEditModal from "./AdminCommentEditModal";
import AdminCommentDeleteModal from "./AdminCommentDeleteModal";
import {
  formatAdminCommentDate,
  getAdminHouseLabel,
  getAdminUserFullName,
  getAdminUserInitials,
  getNumericRating,
} from "./adminCommentUtils";

interface IAdminCommentFilters {
  rating: string;
  userId: string;
  houseId: string;
  order: "DESC" | "ASC";
}

const defaultFilters: IAdminCommentFilters = {
  rating: "all",
  userId: "",
  houseId: "",
  order: "DESC",
};

const ratingOptions = [
  { value: "all", label: "همه" },
  { value: "5", label: "5 ستاره" },
  { value: "4", label: "4 ستاره" },
  { value: "3", label: "3 ستاره" },
  { value: "2", label: "2 ستاره" },
  { value: "1", label: "1 ستاره" },
];

const orderOptions: { value: "DESC" | "ASC"; label: string }[] = [
  { value: "DESC", label: "جدیدترین" },
  { value: "ASC", label: "قدیمی‌ترین" },
];

const perPageOptions = [
  { value: "10", label: "10 در هر صفحه" },
  { value: "20", label: "20 در هر صفحه" },
  { value: "30", label: "30 در هر صفحه" },
];

const thClass =
  "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base";
const tdClass =
  "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base";
const chipClass =
  "cursor-pointer rounded-[12px] border px-3 py-2 text-sm font-normal transition-colors";
const chipActiveClass = "border-primary-500 bg-primary-500 text-white";
const chipIdleClass =
  "border-neutral-300 text-default-text hover:bg-primary-50 dark:hover:bg-neutral-200";

const AdminCommentsPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [whichPage, setWhichPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const [filters, setFilters] = useState<IAdminCommentFilters>(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [draftFilters, setDraftFilters] =
    useState<IAdminCommentFilters>(defaultFilters);

  const [editTarget, setEditTarget] = useState<IAdminComment | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      page: whichPage,
      limit: perPage,
      sort: "created_at" as const,
      order: filters.order,
      rating: filters.rating !== "all" ? filters.rating : undefined,
      user_id: filters.userId.trim() || undefined,
      house_id: filters.houseId.trim() || undefined,
    }),
    [whichPage, perPage, filters],
  );

  const { data: apiData, isLoading: isTableLoading } =
    useGetAdminComments(queryParams);
  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateAdminComment();
  const { mutate: deleteComment, isPending: isDeleting } =
    useDeleteAdminComment();

  const comments = useMemo(() => apiData?.data ?? [], [apiData?.data]);
  const totalCount = apiData?.totalCount ?? 0;
  const totalPages = apiData?.totalPages ?? 1;

  const displayedComments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return comments;
    return comments.filter((c) => {
      const userName = getAdminUserFullName(c.user).toLowerCase();
      const houseTitle = getAdminHouseLabel(c.house).toLowerCase();
      const title = (c.title || "").toLowerCase();
      const caption = (c.caption || "").toLowerCase();
      return (
        userName.includes(q) ||
        houseTitle.includes(q) ||
        title.includes(q) ||
        caption.includes(q)
      );
    });
  }, [comments, search]);

  useEffect(() => {
    setWhichPage(1);
  }, [filters, perPage]);

  useEffect(() => {
    if (!isTableLoading && totalPages > 0 && whichPage > totalPages) {
      setWhichPage(totalPages);
    }
  }, [whichPage, totalPages, isTableLoading]);

  const activeFilterCount =
    (filters.rating !== "all" ? 1 : 0) +
    (filters.userId.trim() ? 1 : 0) +
    (filters.houseId.trim() ? 1 : 0) +
    (filters.order !== "DESC" ? 1 : 0);

  const handleFilterOpenChange = (open: boolean) => {
    if (open) {
      setDraftFilters(filters);
    }
    setIsFilterOpen(open);
  };

  const applyFilters = () => {
    setFilters(draftFilters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setDraftFilters(defaultFilters);
  };

  const openDetails = (id: string) => {
    router.push(`?commentId=${id}`, { scroll: false });
  };

  const getDropDownOptions = (comment: IAdminComment) => [
    {
      label: "جزئیات",
      icon: AlertCircleIcon,
      onClick: () => openDetails(comment.id),
    },
    {
      label: "ویرایش",
      icon: Edit02Icon,
      onClick: () => setEditTarget(comment),
    },
    {
      label: "حذف",
      icon: TrashIcon,
      onClick: () => setDeleteTargetId(comment.id),
    },
  ];

  const handleEditSubmit = (values: {
    title: string;
    caption: string;
    rating: number;
  }) => {
    if (!editTarget) return;
    updateComment(
      {
        id: editTarget.id,
        title: values.title,
        caption: values.caption,
        rating: values.rating,
      },
      {
        onSuccess: (res) => {
          if (res.success) setEditTarget(null);
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    deleteComment(deleteTargetId, {
      onSettled: () => setDeleteTargetId(null),
    });
  };

  return (
    <div dir="rtl" className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-lg font-bold text-default-text sm:text-[20px]">
          مدیریت نظرات ({totalCount})
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
                      aria-pressed={draftFilters.rating === option.value}
                      onClick={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          rating: option.value,
                        }))
                      }
                      className={`${chipClass} ${
                        draftFilters.rating === option.value
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
                  ترتیب نمایش
                </p>
                <div className="flex flex-wrap gap-2">
                  {orderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={draftFilters.order === option.value}
                      onClick={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          order: option.value,
                        }))
                      }
                      className={`${chipClass} ${
                        draftFilters.order === option.value
                          ? chipActiveClass
                          : chipIdleClass
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="filter-house-id"
                    className="text-sm font-semibold text-default-text"
                  >
                    شناسه ملک (House ID)
                  </label>
                  <input
                    id="filter-house-id"
                    type="number"
                    min={1}
                    value={draftFilters.houseId}
                    onChange={(e) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        houseId: e.target.value,
                      }))
                    }
                    placeholder="مثلاً 117"
                    className="w-full rounded-[14px] border border-neutral-300 bg-transparent px-3.5 py-2.5 text-sm text-default-text outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="filter-user-id"
                    className="text-sm font-semibold text-default-text"
                  >
                    شناسه کاربر (User ID)
                  </label>
                  <input
                    id="filter-user-id"
                    type="number"
                    min={1}
                    value={draftFilters.userId}
                    onChange={(e) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        userId: e.target.value,
                      }))
                    }
                    placeholder="مثلاً 358"
                    className="w-full rounded-[14px] border border-neutral-300 bg-transparent px-3.5 py-2.5 text-sm text-default-text outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
        <div className="max-h-130 overflow-x-auto overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-260 text-xs sm:text-sm">
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
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-48" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-6 w-20 rounded-[8px]" />
                    </td>
                    <td className="py-3 pl-3">
                      <Skeleton className="mr-auto size-6 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : displayedComments.length === 0 ? (
                <tr className="border-t border-neutral-300">
                  <td
                    colSpan={8}
                    className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                  >
                    نظری یافت نشد
                  </td>
                </tr>
              ) : (
                displayedComments.map((comment) => {
                  const ratingVal = getNumericRating(comment.rating);

                  return (
                    <tr
                      key={comment.id}
                      className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                    >
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-3">
                          {comment.user?.profilePicture ? (
                            <ImageFallback
                              src={comment.user.profilePicture}
                              alt={getAdminUserFullName(comment.user)}
                              width={32}
                              height={32}
                              className="size-8 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-xs font-bold text-primary-500">
                              {getAdminUserInitials(comment.user)}
                            </div>
                          )}
                          <span className="whitespace-nowrap text-sm font-normal text-default-text sm:text-base">
                            {getAdminUserFullName(comment.user)}
                          </span>
                        </div>
                      </td>

                      <td className="max-w-44 py-3 pl-3">
                        <span
                          title={getAdminHouseLabel(comment.house)}
                          className="block truncate text-sm font-normal text-default-text sm:text-base"
                        >
                          {getAdminHouseLabel(comment.house)}
                        </span>
                      </td>

                      <td className="max-w-36 py-3 pl-3">
                        <span
                          title={comment.title}
                          className="block truncate text-sm font-normal text-default-text sm:text-base"
                        >
                          {comment.title}
                        </span>
                      </td>

                      <td className="max-w-48 py-3 pl-4 sm:max-w-64 lg:max-w-80">
                        <span
                          title={comment.caption}
                          className="block truncate text-sm font-normal text-default-text sm:text-base"
                        >
                          {comment.caption}
                        </span>
                      </td>

                      <td className="py-3 pl-3">
                        <div className="inline-flex items-center gap-1 text-sm font-semibold text-default-text">
                          <HugeiconsIcon
                            icon={StarIcon}
                            className="size-4 fill-amber-400 text-amber-400"
                          />
                          <span>{ratingVal}</span>
                        </div>
                      </td>

                      <td className={`${tdClass} pl-3`}>
                        {formatAdminCommentDate(comment.created_at)}
                      </td>

                      <td className="py-3 pl-3">
                        {comment.parent_comment_id ? (
                          <span className="inline-flex whitespace-nowrap rounded-[8px] bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                            پاسخ
                          </span>
                        ) : (
                          <span className="inline-flex whitespace-nowrap rounded-[8px] bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                            نظر اصلی
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
              currentPage={whichPage}
              onPageChange={(page) => setWhichPage(page)}
              totalPages={totalPages}
              siblingCount={0}
              containerClassName="w-fit! bg-transparent! gap-1! sm:gap-2!"
              itemClassName="cursor-pointer! size-7! rounded-full! flex! items-center! justify-center!"
              buttonsClassName="cursor-pointer! rounded-full! flex! items-center! justify-center! p-0 mx-1! sm:mx-2! size-7"
            />
          </div>
          <div className="hidden shrink-0 sm:block">
            <SelectComponent
              items={perPageOptions}
              placeHolder="تعداد نمایش"
              onChange={(value: string | null) =>
                setPerPage(value ? Number(value) : 10)
              }
              triggerClassName="bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto!"
            />
          </div>
        </div>
      </div>

      <Suspense>
        <AdminCommentDetailModal
          onEdit={(comment) => setEditTarget(comment)}
          onDelete={(id) => setDeleteTargetId(id)}
        />
      </Suspense>

      <AdminCommentEditModal
        comment={editTarget}
        isSubmitting={isUpdating}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEditSubmit}
      />

      <AdminCommentDeleteModal
        open={Boolean(deleteTargetId)}
        isDeleting={isDeleting}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminCommentsPage;
