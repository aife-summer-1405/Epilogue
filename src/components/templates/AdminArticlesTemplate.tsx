"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NewsIcon,
  RefreshIcon,
  Search01Icon,
  ArrowUpDownIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import {
  createAdminArticleAction,
  deleteAdminArticleAction,
  getAdminArticleByIdAction,
  getAdminArticlesAction,
  updateAdminArticleAction,
} from "@/app/actions/admin/articles.action";
import type {
  AdminArticleItem,
  AdminArticlesListResponse,
  AdminArticlesQueryParams,
  CreateAdminArticlePayload,
} from "@/core/types/adminArticle";
import { AdminArticlesTable } from "@/components/organisms/AdminArticlesTable";
import {
  AdminArticleDetailModal,
  AdminArticleFormModal,
} from "@/components/molecules/AdminArticleModal";
import { Pagination } from "@/components/molecules";
import { toPersianDigits } from "@/lib/formatters/house";

const DEFAULT_PARAMS: AdminArticlesQueryParams = {
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "DESC",
  title: "",
  author_id: "",
  category_id: "",
};

export function AdminArticlesTemplate() {
  const [params, setParams] = useState<AdminArticlesQueryParams>(DEFAULT_PARAMS);
  const [items, setItems] = useState<AdminArticleItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [detailArticle, setDetailArticle] = useState<AdminArticleItem | null>(
    null
  );
  const [editArticle, setEditArticle] = useState<AdminArticleItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<AdminArticlesListResponse>({
      queryKey: ["AdminArticles", params],
      queryFn: () => getAdminArticlesAction(params),
      placeholderData: (prev) => prev,
    });

  useEffect(() => {
    if (data) {
      setItems(data.data ?? []);
      setTotalCount(data.totalCount ?? data.data?.length ?? 0);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : "خطا در دریافت لیست مقالات"
      );
    }
  }, [isError, error]);

  const handleCreate = async (payload: CreateAdminArticlePayload) => {
    setIsSubmitting(true);
    try {
      const created = await createAdminArticleAction(payload);
      setItems((prev) => [created, ...prev]);
      setTotalCount((prev) => prev + 1);
      toast.success("مقاله جدید با موفقیت ایجاد شد");
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در ایجاد مقاله");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (payload: CreateAdminArticlePayload) => {
    if (!editArticle) return;
    setIsSubmitting(true);
    try {
      const updated = await updateAdminArticleAction({
        id: editArticle.id,
        ...payload,
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === editArticle.id
            ? {
                ...item,
                ...(updated && typeof updated === "object" ? updated : {}),
                id: editArticle.id,
                ...payload,
              }
            : item
        )
      );
      toast.success("مقاله با موفقیت ویرایش شد");
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در ویرایش مقاله");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (article: AdminArticleItem) => {
    try {
      await deleteAdminArticleAction(article.id);
      setItems((prev) => prev.filter((item) => item.id !== article.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      toast.success("مقاله حذف شد");
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در حذف مقاله");
    }
  };

  const handleOpenDetail = async (article: AdminArticleItem) => {
    setDetailArticle(article);
    try {
      const fresh = await getAdminArticleByIdAction(article.id);
      setDetailArticle(fresh);
    } catch {
    }
  };

  const handleResetFilters = () => {
    setParams(DEFAULT_PARAMS);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / params.limit));

  return (
    <section
      dir="rtl"
      className="w-full space-y-6 p-4 sm:p-6 text-default-text"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
            مدیریت مقالات
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
            ایجاد، مشاهده، فیلتر، ویرایش و حذف مقالات وبلاگ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={15}
              color="currentColor"
              strokeWidth={2}
            />
            <span>ایجاد مقاله جدید</span>
          </button>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content px-4 py-2 text-xs font-bold text-default-text hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              size={15}
              color="currentColor"
              strokeWidth={2}
              className={isFetching ? "animate-spin text-primary-500" : ""}
            />
            <span>بروزرسانی لیست</span>
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm"
      >
        <div>
          <p className="text-xs text-neutral-800 dark:text-neutral-600">
            تعداد کل مقالات
          </p>
          <p className="mt-1 text-2xl font-extrabold text-default-text">
            {toPersianDigits(totalCount)}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
          <HugeiconsIcon icon={NewsIcon} size={22} color="currentColor" />
        </div>
      </motion.div>

      <div className="space-y-4 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              value={params.title || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  title: e.target.value,
                  page: 1,
                }))
              }
              placeholder="جستجو بر اساس عنوان مقاله..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-600">
              <HugeiconsIcon
                icon={ArrowUpDownIcon}
                size={15}
                color="currentColor"
              />
              <span>مرتب‌سازی:</span>
            </div>

            <select
              value={params.sort || "created_at"}
              onChange={(e) => {
                setParams((prev) => ({
                  ...prev,
                  sort: e.target.value,
                  page: 1,
                }));
              }}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="created_at">تاریخ انتشار</option>
              <option value="title">عنوان</option>
              <option value="id">شناسه مقاله</option>
            </select>

            <select
              value={params.order || "DESC"}
              onChange={(e) => {
                setParams((prev) => ({
                  ...prev,
                  order: e.target.value === "ASC" ? "ASC" : "DESC",
                  page: 1,
                }));
              }}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="DESC">نزولی</option>
              <option value="ASC">صعودی</option>
            </select>

            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              inputMode="numeric"
              value={params.author_id || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  author_id: toPersianDigits(e.target.value),
                  page: 1,
                }))
              }
              placeholder="فیلتر شناسه نویسنده..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              inputMode="numeric"
              value={params.category_id || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  category_id: toPersianDigits(e.target.value),
                  page: 1,
                }))
              }
              placeholder="فیلتر شناسه دسته‌بندی..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="h-16 w-full animate-pulse rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <AdminArticlesTable
            articles={items}
            isLoading={isLoading}
            onView={handleOpenDetail}
            onEdit={(a) => setEditArticle(a)}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
              <p className="text-xs text-neutral-800 dark:text-neutral-600">
                صفحه{" "}
                <strong className="text-default-text">
                  {toPersianDigits(params.page)}
                </strong>{" "}
                از{" "}
                <strong className="text-default-text">
                  {toPersianDigits(totalPages)}
                </strong>{" "}
                ({toPersianDigits(totalCount)} مقاله)
              </p>

              <Pagination
                currentPage={params.page}
                totalPages={totalPages}
                onPageChange={(nextPage) =>
                  setParams((prev) => ({ ...prev, page: nextPage }))
                }
                itemClassName="cursor-pointer"
                buttonsClassName="cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {detailArticle && (
        <AdminArticleDetailModal
          article={detailArticle}
          onClose={() => setDetailArticle(null)}
        />
      )}

      <AdminArticleFormModal
        isOpen={isCreateOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {editArticle && (
        <AdminArticleFormModal
          key={editArticle.id}
          isOpen={Boolean(editArticle)}
          article={editArticle}
          isSubmitting={isSubmitting}
          onClose={() => setEditArticle(null)}
          onSubmit={handleSaveEdit}
        />
      )}
    </section>
  );
}