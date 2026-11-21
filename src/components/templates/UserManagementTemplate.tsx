"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format as formatJalali,
  getDay,
  isSameDay,
  isValid,
  parse,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultiple02Icon,
  Search01Icon,
  RefreshIcon,
  ShieldUserIcon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  Calendar03Icon,
  ArrowUpDownIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { useAdminUsersQuery } from "@/hooks/useAdminUsers";
import type {
  AdminUserItem,
  GetAdminUsersResponse,
} from "@/core/types/userManagement.types";
import { UsersListTable } from "@/components/organisms/UsersListTable";
import { UserDeleteModal } from "@/components/molecules/UserDeleteModal";
import { Pagination } from "../molecules";

interface UserManagementTemplateProps {
  initialData?: GetAdminUsersResponse;
}

const ITEMS_PER_PAGE = 10;
const WEEK_DAYS_FA = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function normalizeMembershipQueryDate(raw?: string): string | undefined {
  if (!raw || !raw.trim()) return undefined;
  const trimmed = raw.trim().replace(/-/g, "/");

  const jalaliParsed = parse(trimmed, "yyyy/MM/dd", new Date(), {
    locale: faIR,
  });
  if (isValid(jalaliParsed) && jalaliParsed.getFullYear() >= 1900) {
    return jalaliParsed.toISOString().slice(0, 10);
  }

  const isoParsed = parseISO(raw.trim());
  if (isValid(isoParsed)) {
    return isoParsed.toISOString().slice(0, 10);
  }

  const nativeParsed = new Date(raw.trim());
  if (isValid(nativeParsed)) {
    return nativeParsed.toISOString().slice(0, 10);
  }

  return raw.trim();
}

export function UserManagementTemplate({
  initialData,
}: UserManagementTemplateProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | string>("all");
  const [membershipDateFilter, setMembershipDateFilter] = useState("");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null);

  const [isMembershipCalendarOpen, setIsMembershipCalendarOpen] = useState(false);
  const [membershipCalendarMonth, setMembershipCalendarMonth] = useState<Date>(
    () => new Date()
  );

  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const normalizedMembershipDate = useMemo(
    () => normalizeMembershipQueryDate(membershipDateFilter),
    [membershipDateFilter]
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminUsersQuery({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort: sortField,
      order: sortOrder,
      email: emailFilter || undefined,
      role: roleFilter !== "all" ? roleFilter : undefined,
      membershipDate: normalizedMembershipDate,
      search: searchQuery || undefined,
    });

  const users = data?.data ?? initialData?.data ?? [];
  const totalCount =
    data?.totalCount ?? initialData?.totalCount ?? users.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole =
        roleFilter === "all" ||
        u.role?.toLowerCase() === roleFilter.toLowerCase();

      const matchesEmail =
        !emailFilter.trim() ||
        u.email?.toLowerCase().includes(emailFilter.trim().toLowerCase());

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesRole && matchesEmail;

      const full =
        `${u.firstName ?? ""} ${u.lastName ?? ""} ${u.fullName ?? ""} ${u.email ?? ""} ${u.phoneNumber ?? ""} ${u.id}`.toLowerCase();
      return matchesRole && matchesEmail && full.includes(q);
    });
  }, [users, roleFilter, emailFilter, searchQuery]);

  const adminCount = useMemo(
    () => users.filter((u) => u.role?.toLowerCase() === "admin").length,
    [users]
  );

  const verifiedCount = useMemo(
    () => users.filter((u) => u.emailVerified).length,
    [users]
  );

  const parsedMembershipDateObj = useMemo(() => {
    if (!membershipDateFilter.trim()) return null;
    const trimmed = membershipDateFilter.trim().replace(/-/g, "/");

    const jalaliDate = parse(trimmed, "yyyy/MM/dd", new Date(), {
      locale: faIR,
    });
    if (isValid(jalaliDate) && jalaliDate.getFullYear() >= 1900) {
      return jalaliDate;
    }

    const isoDate = parseISO(membershipDateFilter.trim());
    if (isValid(isoDate)) return isoDate;

    const nativeDate = new Date(membershipDateFilter.trim());
    if (isValid(nativeDate)) return nativeDate;

    return null;
  }, [membershipDateFilter]);

  const membershipMonthStart = startOfMonth(membershipCalendarMonth);
  const membershipMonthEnd = endOfMonth(membershipCalendarMonth);
  const membershipDaysInMonth = eachDayOfInterval({
    start: membershipMonthStart,
    end: membershipMonthEnd,
  });
  const membershipLeadingEmptyDays = (getDay(membershipMonthStart) + 1) % 7;

  const handleSelectMembershipDay = (day: Date) => {
    const formattedJalali = formatJalali(day, "yyyy/MM/dd", { locale: faIR });
    setMembershipDateFilter(formattedJalali);
    setCurrentPage(1);
    setIsMembershipCalendarOpen(false);
  };

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setEmailFilter("");
    setRoleFilter("all");
    setMembershipDateFilter("");
    setSortField("createdAt");
    setSortOrder("DESC");
    setIsMembershipCalendarOpen(false);
    setCurrentPage(1);
  };

  return (
    <section dir="rtl" className="w-full space-y-6 p-4 sm:p-6">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border px-4 py-3 text-xs sm:text-sm font-bold shadow-sm ${
            toast.type === "success"
              ? "border-success-400 bg-success-50 text-success-800 dark:bg-success-900/30 dark:text-success-400"
              : "border-danger-400 bg-danger-50 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400"
          }`}
        >
          {toast.text}
        </motion.div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
            مدیریت کاربران
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
            مشاهده لیست کاربران، فیلتر نقش و ایمیل، مرتب‌سازی، ویرایش و حذف حساب کاربری
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content px-4 py-2 text-xs font-bold text-default-text hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              کل کاربران ثبت‌شده
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(totalCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
            <HugeiconsIcon
              icon={UserMultiple02Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              مدیران (در صفحه جاری)
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(adminCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 dark:bg-secondary-100/40 dark:text-secondary-700">
            <HugeiconsIcon
              icon={ShieldUserIcon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              ایمیل تاییدشده (در صفحه جاری)
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(verifiedCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-500">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: "همه نقش‌ها" },
              { key: "admin", label: "ادمین" },
              { key: "seller", label: "فروشنده" },
              { key: "buyer", label: "خریدار" },
            ].map((tab) => {
              const active = roleFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setRoleFilter(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 dark:bg-neutral-50 text-neutral-800 dark:text-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
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
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="createdAt">تاریخ ایجاد </option>
              <option value="membershipDate">تاریخ عضویت </option>
              <option value="email">ایمیل </option>
              <option value="fullName">نام </option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "ASC" | "DESC");
                setCurrentPage(1);
              }}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="DESC">نزولی </option>
              <option value="ASC">صعودی </option>
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
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="جستجو بر اساس نام، موبایل یا شناسه..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="relative">
            <HugeiconsIcon
              icon={Mail01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              value={emailFilter}
              onChange={(e) => {
                setEmailFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="فیلتر ایمیل (email)..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="relative">
            <div
              onClick={() => {
                if (parsedMembershipDateObj) {
                  setMembershipCalendarMonth(parsedMembershipDateObj);
                }
                setIsMembershipCalendarOpen((prev) => !prev);
              }}
              className="relative cursor-pointer"
            >
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={18}
                color="currentColor"
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
              />
              <input
                type="text"
                readOnly
                value={membershipDateFilter}
                placeholder="تاریخ عضویت"
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors cursor-pointer"
              />
            </div>

            {isMembershipCalendarOpen && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-neutral-300 dark:border-neutral-200 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setMembershipCalendarMonth((m) => subMonths(m, 1))
                    }
                    className="rounded-lg p-1.5 text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100 cursor-pointer"
                    aria-label="ماه قبل"
                  >
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={16}
                      color="currentColor"
                    />
                  </button>

                  <span className="text-sm font-bold text-default-text">
                    {formatJalali(membershipCalendarMonth, "MMMM yyyy", {
                      locale: faIR,
                    })}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setMembershipCalendarMonth((m) => addMonths(m, 1))
                    }
                    className="rounded-lg p-1.5 text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100 cursor-pointer"
                    aria-label="ماه بعد"
                  >
                    <HugeiconsIcon
                      icon={ArrowLeft01Icon}
                      size={16}
                      color="currentColor"
                    />
                  </button>
                </div>

                <div className="mb-1.5 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-neutral-800 dark:text-neutral-600">
                  {WEEK_DAYS_FA.map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({ length: membershipLeadingEmptyDays }).map(
                    (_, i) => (
                      <div key={`empty-${i}`} className="h-8" />
                    )
                  )}

                  {membershipDaysInMonth.map((day) => {
                    const isSelected =
                      parsedMembershipDateObj &&
                      isSameDay(day, parsedMembershipDateObj);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => handleSelectMembershipDay(day)}
                        className={`h-8 rounded-lg font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-primary-500 text-white"
                            : isToday
                              ? "border border-primary-500 text-primary-600 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-100/20"
                              : "text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100"
                        }`}
                      >
                        {formatJalali(day, "d", { locale: faIR })}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-100 pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMembershipDateFilter("");
                      setCurrentPage(1);
                      setIsMembershipCalendarOpen(false);
                    }}
                    className="font-semibold text-danger-600 dark:text-danger-400 hover:underline cursor-pointer"
                  >
                    پاک کردن
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectMembershipDay(new Date())}
                      className="font-bold text-primary-500 dark:text-primary-200 hover:underline cursor-pointer"
                    >
                      امروز
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMembershipCalendarOpen(false)}
                      className="font-bold text-neutral-800 dark:text-neutral-600 hover:underline cursor-pointer"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              </div>
            )}
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
          <p className="text-sm font-bold">خطا در دریافت لیست کاربران</p>
          <p className="mt-1 text-xs">{error?.message}</p>
        </div>
      ) : (
        <>
          <UsersListTable
            users={filteredUsers}
            onRequestDelete={(user) => setUserToDelete(user)}
            onRoleFeedback={showToast}
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
                ({new Intl.NumberFormat("fa-IR").format(totalCount)} کاربر)
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

      <UserDeleteModal
        user={userToDelete}
        onClose={() => setUserToDelete(null)}
        onSuccess={(msg) => showToast("success", msg)}
        onError={(msg) => showToast("error", msg)}
      />
    </section>
  );
}