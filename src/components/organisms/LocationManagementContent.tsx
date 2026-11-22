"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Search01Icon,
  RefreshIcon,
  Add01Icon,
  ArrowUpDownIcon,
  MapsLocation01Icon,
  Compass01Icon,
} from "@hugeicons/core-free-icons";
import { useAdminLocationsQuery } from "@/hooks/useAdminLocations";
import type {
  GetLocationsResponse,
  LocationItem,
} from "@/core/types/location.types";
import { LocationsListTable } from "@/components/organisms/LocationsListTable";
import { LocationFormModal } from "@/components/molecules/LocationFormModal";
import { LocationDeleteModal } from "@/components/molecules/LocationDeleteModal";
import { LocationPreviewModal } from "@/components/molecules/LocationPreviewModal";
import { Pagination } from "@/components/molecules";

interface LocationManagementContentProps {
  initialData?: GetLocationsResponse;
}

const ITEMS_PER_PAGE = 10;

export function LocationManagementContent({
  initialData,
}: LocationManagementContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [areaNameFilter, setAreaNameFilter] = useState("");
  const [latFilter, setLatFilter] = useState("");
  const [lngFilter, setLngFilter] = useState("");
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(
    null
  );
  const [deletingLocation, setDeletingLocation] = useState<LocationItem | null>(
    null
  );
  const [previewLocation, setPreviewLocation] = useState<LocationItem | null>(
    null
  );

  const parsedLat = latFilter.trim() !== "" ? Number(latFilter) : undefined;
  const parsedLng = lngFilter.trim() !== "" ? Number(lngFilter) : undefined;

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminLocationsQuery({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort: sortField,
      order: sortOrder,
      area_name: areaNameFilter.trim() || undefined,
      lat: parsedLat,
      lng: parsedLng,
    });

  const locations = data?.data ?? initialData?.data ?? [];
  const totalCount =
    data?.totalCount ?? initialData?.totalCount ?? locations.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setAreaNameFilter("");
    setLatFilter("");
    setLngFilter("");
    setSortField("id");
    setSortOrder("ASC");
    setCurrentPage(1);
  };

  const handleOpenCreateModal = () => {
    setEditingLocation(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: LocationItem) => {
    setEditingLocation(item);
    setIsFormModalOpen(true);
  };

  return (
    <section dir="rtl" className="w-full space-y-6 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
            مدیریت موقعیت‌های مکانی
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
            مشاهده، جستجو، افزودن، ویرایش مختصات روی نقشه و حذف مناطق
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content px-4 py-2.5 text-xs font-bold text-default-text hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
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

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-600 transition-colors cursor-pointer shadow-sm"
          >
            <HugeiconsIcon
              icon={Add01Icon}
              size={16}
              color="currentColor"
              strokeWidth={2.2}
            />
            <span>افزودن موقعیت جدید</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              کل موقعیت‌های ثبت‌شده
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(totalCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
            <HugeiconsIcon
              icon={Location01Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              مناطق نمایش‌داده‌شده در صفحه
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(locations.length)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 dark:bg-secondary-100/40 dark:text-secondary-700">
            <HugeiconsIcon
              icon={MapsLocation01Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              صفحه فعلی از کل صفحات
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(currentPage)} /{" "}
              {new Intl.NumberFormat("fa-IR").format(totalPages)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-500">
            <HugeiconsIcon
              icon={Compass01Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs font-extrabold text-default-text">
            فیلتر و مرتب‌سازی موقعیت‌ها
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-600">
              <HugeiconsIcon
                icon={ArrowUpDownIcon}
                size={15}
                color="currentColor"
              />
              <span>مرتب‌سازی بر اساس:</span>
            </div>

            <select
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="id">شناسه </option>
              <option value="area_name">نام منطقه </option>
              <option value="lat">عرض جغرافیایی </option>
              <option value="lng">طول جغرافیایی </option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "ASC" | "DESC");
                setCurrentPage(1);
              }}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="ASC">صعودی </option>
              <option value="DESC">نزولی </option>
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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              value={areaNameFilter}
              onChange={(e) => {
                setAreaNameFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="جستجو نام منطقه "
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="relative">
            <HugeiconsIcon
              icon={Compass01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="number"
              step="any"
              value={latFilter}
              onChange={(e) => {
                setLatFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="فیلتر عرض جغرافیایی "
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="relative">
            <HugeiconsIcon
              icon={Compass01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="number"
              step="any"
              value={lngFilter}
              onChange={(e) => {
                setLngFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="فیلتر طول جغرافیایی "
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {isLoading && !initialData ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((skeleton) => (
            <div
              key={skeleton}
              className="h-16 w-full animate-pulse rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-danger-300 dark:border-danger-700 bg-danger-50 dark:bg-danger-900/30 p-6 text-center text-danger-700 dark:text-danger-400">
          <p className="text-sm font-bold">خطا در دریافت لیست موقعیت‌ها</p>
          <p className="mt-1 text-xs">{error?.message}</p>
        </div>
      ) : (
        <>
          <LocationsListTable
            locations={locations}
            onRequestEdit={handleOpenEditModal}
            onRequestDelete={(loc) => setDeletingLocation(loc)}
            onRequestPreviewMap={(loc) => setPreviewLocation(loc)}
          />

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
              <p className="text-xs text-neutral-800 dark:text-neutral-600">
                صفحه{" "}
                <strong className="text-default-text">
                  {new Intl.NumberFormat("fa-IR").format(currentPage)}
                </strong>{" "}
                از{" "}
                <strong className="text-default-text">
                  {new Intl.NumberFormat("fa-IR").format(totalPages)}
                </strong>{" "}
                ({new Intl.NumberFormat("fa-IR").format(totalCount)} موقعیت)
              </p>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                buttonsClassName="cursor-pointer"
              />
            </div>
          )}
        </>
      )}

      <LocationFormModal
        isOpen={isFormModalOpen}
        editingLocation={editingLocation}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingLocation(null);
        }}
      />

      <LocationDeleteModal
        location={deletingLocation}
        onClose={() => setDeletingLocation(null)}
      />

      <LocationPreviewModal
        location={previewLocation}
        onClose={() => setPreviewLocation(null)}
      />
    </section>
  );
}