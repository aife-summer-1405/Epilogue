"use client";

import { FormEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Delete01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import {
  House,
  TransactionType,
  UpdateHousePayload,
} from "@/core/types/house";
import { useUpdateAdminHouse } from "@/hooks/use-houses";
import {
  formatCategoryFa,
  formatYardTypeFa,
  normalizeCategoryToApi,
  normalizeYardTypeToApi,
  sanitizeDecimalInput,
  toPersianDigits,
} from "@/lib/formatters/house";
import Button from "../atoms/button/Button";

const HouseLocationPicker = dynamic(
  () => import("@/components/molecules/HouseLocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 w-full animate-pulse rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] flex items-center justify-center text-xs text-neutral-800 dark:text-neutral-600">
        در حال بارگذاری نقشه...
      </div>
    ),
  }
);

interface HouseEditModalProps {
  house: House;
  onClose: () => void;
}

export function HouseEditModal({ house, onClose }: HouseEditModalProps) {
  const updateMutation = useUpdateAdminHouse();

  const [title, setTitle] = useState(house.title ?? "");
  const [address, setAddress] = useState(house.address ?? "");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [rate, setRate] = useState(String(house.rate ?? "0"));
  const [price, setPrice] = useState(String(house.price ?? "0"));
  const [photosText, setPhotosText] = useState(
    (house.photos ?? []).join("\n")
  );
  const [tags, setTags] = useState<string[]>(house.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [capacity, setCapacity] = useState(String(house.capacity ?? "1"));
  const [lat, setLat] = useState(String(house.location?.lat ?? "35.6892"));
  const [lng, setLng] = useState(String(house.location?.lng ?? "51.3890"));
  const [categoryName, setCategoryName] = useState(
    formatCategoryFa(house.categories?.name ?? "suite")
  );
  const [bathrooms, setBathrooms] = useState(String(house.bathrooms ?? "1"));
  const [parking, setParking] = useState(String(house.parking ?? "0"));
  const [rooms, setRooms] = useState(String(house.rooms ?? "1"));
  const [yardType, setYardType] = useState(
    formatYardTypeFa(house.yard_type ?? "none")
  );
  const [numComments, setNumComments] = useState(
    String(house.num_comments ?? "0")
  );
  const [transactionType, setTransactionType] = useState<TransactionType>(
    house.transaction_type ?? "reservation"
  );
  const [caption, setCaption] = useState(house.caption ?? "");

  useEffect(() => {
    const query = address.trim();
    if (query.length < 4 || query === (house.address ?? "").trim()) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setIsGeocoding(true);
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          query
        )}`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });
        if (!res.ok) return;

        const results: Array<{ lat: string; lon: string }> = await res.json();
        if (results.length > 0) {
          const foundLat = Number(Number(results[0].lat).toFixed(6));
          const foundLng = Number(Number(results[0].lon).toFixed(6));
          if (Number.isFinite(foundLat) && Number.isFinite(foundLng)) {
            setLat(String(foundLat));
            setLng(String(foundLng));
          }
        }
      } catch (err) {
        if ((err as { name?: string })?.name !== "AbortError") {
          toast.error("امکان یافتن موقعیت آدرس روی نقشه وجود نداشت");
        }
      } finally {
        setIsGeocoding(false);
      }
    }, 700);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [address, house.address]);

  const handleAddTag = () => {
    const cleanTag = tagInput.trim();
    if (!cleanTag) return;
    if (tags.includes(cleanTag)) {
      toast.warning("این برچسب قبلاً اضافه شده است");
      return;
    }
    setTags((prev) => [...prev, cleanTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload: UpdateHousePayload = {
      title: title.trim(),
      address: address.trim(),
      rate: Number(rate) || 0,
      price: Number(price) || 0,
      photos: photosText
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean),
      tags,
      last_updated: new Date().toISOString(),
      capacity: Number(capacity) || 0,
      location: {
        lat: Number(lat) || 0,
        lng: Number(lng) || 0,
      },
      categories: {
        name: normalizeCategoryToApi(categoryName),
      },
      bathrooms: Number(bathrooms) || 0,
      parking: Number(parking) || 0,
      rooms: Number(rooms) || 0,
      yard_type: normalizeYardTypeToApi(yardType),
      num_comments: Number(numComments) || 0,
      transaction_type: transactionType,
      caption: caption.trim() === "" ? null : caption.trim(),
    };

    await updateMutation.mutateAsync({ id: house.id, payload });
    onClose();
  };

  const inputClass =
    "w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs sm:text-sm text-default-text outline-none focus:border-primary-500 transition-colors";
  const labelClass =
    "mb-1 block text-xs font-bold text-neutral-800 dark:text-neutral-600";

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold">
              ویرایش اقامتگاه #{toPersianDigits(house.id)}
            </h2>

          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>عنوان اقامتگاه</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>نوع معامله</label>
              <select
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value as TransactionType)
                }
                className={inputClass}
              >
                <option value="reservation">رزرو</option>
                <option value="rental">اجاره</option>
                <option value="mortgage">رهن</option>
                <option value="direct_purchase">خرید مستقیم</option>
              </select>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-600">
                آدرس
              </label>
              {isGeocoding && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-500">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    size={13}
                    color="currentColor"
                  />
                  در حال یافتن موقعیت روی نقشه...
                </span>
              )}
            </div>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثلاً: تهران، میدان ولیعصر، خیابان بزرگمهر"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className={labelClass}>قیمت (تومان)</label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={toPersianDigits(price)}
                onChange={(e) => setPrice(sanitizeDecimalInput(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>امتیاز</label>
              <input
                type="text"
                inputMode="decimal"
                value={toPersianDigits(rate)}
                onChange={(e) => setRate(sanitizeDecimalInput(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>ظرفیت</label>
              <input
                type="text"
                inputMode="numeric"
                value={toPersianDigits(capacity)}
                onChange={(e) =>
                  setCapacity(sanitizeDecimalInput(e.target.value).replace(/\./g, ""))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>دسته‌بندی</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="مثلاً: سوئیت، ویلا، آپارتمان"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div>
              <label className={labelClass}>اتاق‌ها</label>
              <input
                type="text"
                inputMode="numeric"
                value={toPersianDigits(rooms)}
                onChange={(e) =>
                  setRooms(sanitizeDecimalInput(e.target.value).replace(/\./g, ""))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>حمام‌ها</label>
              <input
                type="text"
                inputMode="numeric"
                value={toPersianDigits(bathrooms)}
                onChange={(e) =>
                  setBathrooms(
                    sanitizeDecimalInput(e.target.value).replace(/\./g, "")
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>پارکینگ</label>
              <input
                type="text"
                inputMode="numeric"
                value={toPersianDigits(parking)}
                onChange={(e) =>
                  setParking(
                    sanitizeDecimalInput(e.target.value).replace(/\./g, "")
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>نوع حیاط</label>
              <input
                type="text"
                value={yardType}
                onChange={(e) => setYardType(e.target.value)}
                placeholder="مثلاً: بدون حیاط"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>تعداد نظرات</label>
              <input
                type="text"
                inputMode="numeric"
                value={toPersianDigits(numComments)}
                onChange={(e) =>
                  setNumComments(
                    sanitizeDecimalInput(e.target.value).replace(/\./g, "")
                  )
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label className={labelClass}>موقعیت جغرافیایی روی نقشه</label>
            <HouseLocationPicker
              lat={Number(lat)}
              lng={Number(lng)}
              onChange={({ lat: newLat, lng: newLng }) => {
                setLat(String(newLat));
                setLng(String(newLng));
              }}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>عرض جغرافیایی</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={toPersianDigits(lat)}
                  onChange={(e) => setLat(sanitizeDecimalInput(e.target.value))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>طول جغرافیایی</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={toPersianDigits(lng)}
                  onChange={(e) => setLng(sanitizeDecimalInput(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              برچسب‌ها
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="افزودن برچسب جدید..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="primary"
                className="px-6"
              >
                افزودن
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-sm"
                >
                  {toPersianDigits(tag)}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-80 cursor-pointer"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>لینک عکس‌ها (هر لینک در یک خط)</label>
            <textarea
              rows={3}
              value={photosText}
              onChange={(e) => setPhotosText(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>توضیحات / کپشن (خالی = null)</label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-neutral-200 dark:border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-4 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2 text-xs font-bold text-white transition-colors disabled:opacity-60 cursor-pointer"
            >
              {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}