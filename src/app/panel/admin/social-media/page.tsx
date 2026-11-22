"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog } from "@base-ui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Edit02Icon,
  EllipsisVerticalIcon,
  FilterIcon,
  Search02Icon,
  TrashIcon,
} from "@hugeicons/core-free-icons";
import Modal from "@/components/molecules/modal/Modal";
import Button from "@/components/atoms/button/Button";
import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import DropDownMenu from "@/components/molecules/dropdown/DropDownMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { ISocialMediaLink } from "@/core/types/admin/socialMedia.types";
import { useGetSocialMediaLinks } from "@/hooks/queries/useGetSocialMediaLinks";
import {
  useCreateSocialMediaLink,
  useDeleteSocialMediaLink,
  useUpdateSocialMediaLink,
} from "@/hooks/mutations/panel/admin/useSocialMediaMutations";
import SocialMediaFormModal from "./SocialMediaFormModal";
import SocialMediaDeleteModal from "./SocialMediaDeleteModal";

interface ISocialFilters {
  url: string;
  sort: string;
  order: "ASC" | "DESC";
}

const defaultFilters: ISocialFilters = {
  url: "",
  sort: "id",
  order: "ASC",
};

const sortOptions = [
  { value: "id", label: "شناسه" },
  { value: "platform", label: "نام پلتفرم" },
];

const orderOptions: { value: "ASC" | "DESC"; label: string }[] = [
  { value: "ASC", label: "صعودی" },
  { value: "DESC", label: "نزولی" },
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

const AdminSocialMediaPage = () => {
  const [searchPlatform, setSearchPlatform] = useState("");
  const [debouncedPlatform, setDebouncedPlatform] = useState("");
  const [whichPage, setWhichPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [filters, setFilters] = useState<ISocialFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] =
    useState<ISocialFilters>(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ISocialMediaLink | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPlatform(searchPlatform.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchPlatform]);

  const queryParams = useMemo(
    () => ({
      page: whichPage,
      limit: perPage,
      sort: filters.sort || undefined,
      order: filters.order,
      platform: debouncedPlatform || undefined,
      url: filters.url.trim() || undefined,
    }),
    [whichPage, perPage, filters, debouncedPlatform],
  );

  const { data: apiData, isLoading } = useGetSocialMediaLinks(queryParams);
  const { mutate: createLink, isPending: isCreating } =
    useCreateSocialMediaLink();
  const { mutate: updateLink, isPending: isUpdating } =
    useUpdateSocialMediaLink();
  const { mutate: deleteLink, isPending: isDeleting } =
    useDeleteSocialMediaLink();

  const links = useMemo(() => apiData?.data ?? [], [apiData?.data]);
  const totalCount = apiData?.totalCount ?? 0;
  const totalPages = apiData?.totalPages ?? 1;

  useEffect(() => {
    setWhichPage(1);
  }, [debouncedPlatform, filters, perPage]);

  useEffect(() => {
    if (!isLoading && totalPages > 0 && whichPage > totalPages) {
      setWhichPage(totalPages);
    }
  }, [whichPage, totalPages, isLoading]);

  const activeFilterCount =
    (filters.url.trim() ? 1 : 0) +
    (filters.sort !== "id" ? 1 : 0) +
    (filters.order !== "ASC" ? 1 : 0);

  const handleFilterOpenChange = (open: boolean) => {
    if (open) setDraftFilters(filters);
    setIsFilterOpen(open);
  };

  const applyFilters = () => setFilters(draftFilters);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setDraftFilters(defaultFilters);
  };

  const openCreateModal = () => {
    setEditTarget(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: ISocialMediaLink) => {
    setEditTarget(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (values: { platform: string; url: string }) => {
    if (editTarget) {
      updateLink(
        { id: editTarget.id, ...values },
        {
          onSuccess: (res) => {
            if (res.success) {
              setIsFormOpen(false);
              setEditTarget(null);
            }
          },
        },
      );
    } else {
      createLink(values, {
        onSuccess: (res) => {
          if (res.success) setIsFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    deleteLink(deleteTargetId, {
      onSettled: () => setDeleteTargetId(null),
    });
  };

  const getDropDownOptions = (item: ISocialMediaLink) => [
    {
      label: "ویرایش",
      icon: Edit02Icon,
      onClick: () => openEditModal(item),
    },
    {
      label: "حذف",
      icon: TrashIcon,
      onClick: () => setDeleteTargetId(item.id),
    },
  ];

  return (
    <div dir="rtl" className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-lg font-bold text-default-text sm:text-[20px]">
          مدیریت شبکه‌های اجتماعی ({totalCount})
        </p>

        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:gap-4">
          <div className="flex min-w-44 flex-1 items-center justify-between gap-2 rounded-[16px] border border-neutral-300 bg-default-white-bg px-4 py-2.5 lg:w-64 lg:flex-none">
            <input
              type="text"
              value={searchPlatform}
              onChange={(e) => setSearchPlatform(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-base font-normal text-neutral-dark-300 outline-none placeholder:text-neutral-dark-300 dark:text-neutral-400 dark:placeholder:text-neutral-400"
              placeholder="جستجو بر اساس پلتفرم..."
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
            contentClassName="sm:max-w-xl"
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
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="filter-social-url"
                  className="text-sm font-semibold text-default-text"
                >
                  فیلتر بر اساس آدرس (URL)
                </label>
                <input
                  id="filter-social-url"
                  type="text"
                  dir="ltr"
                  value={draftFilters.url}
                  onChange={(e) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }))
                  }
                  placeholder="مثلاً instagram.com"
                  className="w-full rounded-[14px] border border-neutral-300 bg-transparent px-3.5 py-2.5 text-left text-sm text-default-text outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-base font-semibold text-default-text">
                  مرتب‌سازی بر اساس
                </p>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={draftFilters.sort === option.value}
                      onClick={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          sort: option.value,
                        }))
                      }
                      className={`${chipClass} ${
                        draftFilters.sort === option.value
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
            </div>
          </Modal>

          <Button
            type="button"
            onClick={openCreateModal}
            className="shrink-0 cursor-pointer rounded-[16px] px-4 py-2.5 text-sm text-white sm:text-base"
            startIcon={
              <HugeiconsIcon icon={Add01Icon} className="size-5 text-white" />
            }
          >
            افزودن لینک
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
        <div className="max-h-130 overflow-x-auto overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-160 text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-default-white-bg">
              <tr className="text-right">
                <th className={thClass}>شناسه</th>
                <th className={thClass}>پلتفرم</th>
                <th className={thClass}>آدرس لینک</th>
                <th className={`${thClass} text-left`}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }, (_, i) => (
                  <tr key={i} className="border-t border-neutral-300">
                    <td className="py-3 pr-2">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-6 w-24 rounded-[8px]" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-64" />
                    </td>
                    <td className="py-3 pl-3">
                      <Skeleton className="mr-auto size-6 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : links.length === 0 ? (
                <tr className="border-t border-neutral-300">
                  <td
                    colSpan={4}
                    className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                  >
                    لینکی یافت نشد
                  </td>
                </tr>
              ) : (
                links.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                  >
                    <td className={`${tdClass} pr-2`}>#{item.id}</td>
                    <td className="py-3">
                      <span
                        dir="ltr"
                        className="inline-flex rounded-[8px] bg-primary-500/10 px-3 py-1 text-xs font-semibold capitalize text-primary-500 sm:text-sm"
                      >
                        {item.platform}
                      </span>
                    </td>
                    <td className="max-w-xs py-3 pl-4 sm:max-w-md lg:max-w-lg">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        title={item.url}
                        className="block truncate text-left text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {item.url}
                      </a>
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
                          dropDownItems={getDropDownOptions(item)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
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

      <SocialMediaFormModal
        open={isFormOpen}
        initialData={editTarget}
        isSubmitting={isCreating || isUpdating}
        onClose={() => {
          setIsFormOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <SocialMediaDeleteModal
        open={Boolean(deleteTargetId)}
        isDeleting={isDeleting}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminSocialMediaPage;
