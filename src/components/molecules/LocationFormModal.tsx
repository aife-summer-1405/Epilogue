"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Location01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "react-toastify";
import {
  useCreateLocationMutation,
  useUpdateLocationMutation,
} from "@/hooks/useAdminLocations";
import type { LocationItem } from "@/core/types/location.types";

const LocationMapPicker = dynamic(
  () =>
    import("./LocationMapPicker").then((mod) => mod.LocationMapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 sm:h-64 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-50" />
    ),
  }
);

interface LocationFormModalProps {
  isOpen: boolean;
  editingLocation: LocationItem | null;
  onClose: () => void;
}

export function LocationFormModal({
  isOpen,
  editingLocation,
  onClose,
}: LocationFormModalProps) {
  const [areaName, setAreaName] = useState("");
  const [lat, setLat] = useState<string>("35.6892");
  const [lng, setLng] = useState<string>("51.3890");
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "searching" | "found" | "not_found"
  >("idle");

  const initialAreaRef = useRef<string>("");
  const hasUserTypedAreaRef = useRef<boolean>(false);

  const createMutation = useCreateLocationMutation();
  const updateMutation = useUpdateLocationMutation();

  const isEditing = Boolean(editingLocation);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    hasUserTypedAreaRef.current = false;
    setSearchStatus("idle");

    if (editingLocation) {
      setAreaName(editingLocation.areaName);
      initialAreaRef.current = editingLocation.areaName;
      setLat(String(Number(editingLocation.lat)));
      setLng(String(Number(editingLocation.lng)));
    } else {
      setAreaName("");
      initialAreaRef.current = "";
      setLat("35.6892");
      setLng("51.3890");
    }
  }, [editingLocation, isOpen]);

  const handleAreaNameChange = (value: string) => {
    setAreaName(value);
    if (value.trim() !== initialAreaRef.current.trim()) {
      hasUserTypedAreaRef.current = true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (!areaName.trim()) {
      toast.error("لطفاً نام منطقه یا شهر را وارد کنید.");
      return;
    }

    if (Number.isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      toast.error("عرض جغرافیایی  نامعتبر است.");
      return;
    }

    if (Number.isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      toast.error("طول جغرافیایی نامعتبر است.");
      return;
    }

    const payload = {
      area_name: areaName.trim(),
      lat: parsedLat,
      lng: parsedLng,
    };

    try {
      if (editingLocation) {
        await updateMutation.mutateAsync({
          id: editingLocation.id,
          payload,
        });
        toast.success(`موقعیت «${payload.area_name}» با موفقیت ویرایش شد.`);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(`موقعیت «${payload.area_name}» با موفقیت ایجاد شد.`);
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "عملیات با خطا مواجه شد.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="w-full max-w-lg rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 sm:p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/30">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    size={20}
                    color="currentColor"
                  />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-default-text">
                    {isEditing
                      ? "ویرایش موقعیت مکانی"
                      : "افزودن موقعیت مکانی جدید"}
                  </h2>
                  <p className="text-xs text-neutral-800 dark:text-neutral-600">
                    نام منطقه را بنویسید تا نقشه خودکار روی آن برود یا نقطه را کلیک کنید
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={18}
                  color="currentColor"
                />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-xs font-bold text-default-text">
                    نام منطقه / شهر 
                  </label>
                  {searchStatus === "searching" && (
                    <span className="text-[11px] font-bold text-primary-500">
                      در حال جستجو روی نقشه...
                    </span>
                  )}
                  {searchStatus === "found" && (
                    <span className="text-[11px] font-bold text-success-600 dark:text-success-400">
                      منطقه روی نقشه پیدا شد
                    </span>
                  )}
                  {searchStatus === "not_found" && (
                    <span className="text-[11px] font-bold text-danger-600 dark:text-danger-400">
                      نتیجه‌ای یافت نشد؛ دستی انتخاب کنید
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={areaName}
                  onChange={(e) => handleAreaNameChange(e.target.value)}
                  placeholder="مثلاً: شیراز، تبریز، اصفهان..."
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3.5 py-2.5 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-default-text">
                    عرض جغرافیایی
                  </label>
                  <input
                    type="number"
                    step="any"
                    dir="ltr"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="35.6892"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3.5 py-2.5 text-left text-xs sm:text-sm text-default-text outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-default-text">
                    طول جغرافیایی 
                  </label>
                  <input
                    type="number"
                    step="any"
                    dir="ltr"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="51.3890"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3.5 py-2.5 text-left text-xs sm:text-sm text-default-text outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-600">
                  نقشه (با تایپ نام شهر منتقل می‌شود؛ برای دقت بیشتر روی نقطه کلیک کنید)
                </p>
                <LocationMapPicker
                  lat={Number(lat)}
                  lng={Number(lng)}
                  searchQuery={hasUserTypedAreaRef.current ? areaName : ""}
                  onSearchStatusChange={setSearchStatus}
                  onChange={(newLat, newLng) => {
                    setLat(String(newLat));
                    setLng(String(newLng));
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-neutral-200 dark:border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-4 py-2.5 text-xs font-bold text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-600 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={16}
                    color="currentColor"
                  />
                  <span>
                    {isSubmitting
                      ? "در حال ذخیره..."
                      : isEditing
                        ? "ذخیره تغییرات"
                        : "ثبت موقعیت"}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}