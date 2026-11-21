"use client";

import Badge from "@/components/atoms/badge/Badge";
import Button from "@/components/atoms/button/Button";
import DropDownMenu from "@/components/molecules/dropdown/DropDownMenu";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import SelectComponent from "@/components/molecules/select/Select";
import StatCard from "@/components/molecules/statCard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building06Icon,
  EllipsisVerticalIcon,
  HourglassIcon,
  ListChecksIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useGetSellerDashboard } from "@/hooks/queries/useGetSellerDashboard";
import {
  useConfirmSellerBooking,
  useCancelSellerBooking,
  useDeleteSellerBooking,
} from "@/hooks/mutations/panel/seller/useSellerDashboardMutations";
import {
  ISellerBookingItem,
  ISellerDashboardProfile,
} from "@/app/actions/panel/seller/sellerDashboard.actions";

const items = [
  { label: "ماه جاری", value: "month" },
  { label: "سال جاری", value: "year" },
];

const href = "/panel/reserveManagement/buyer";

const progressStyles = buildStyles({
  strokeLinecap: "round",
  pathColor: "var(--color-primary-800)",
  trailColor: "var(--color-neutral-200)",
  textColor: "var(--color-primary-800)",
  textSize: "18px",
});

const formatPersianDateTime = (isoDate?: string): string => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;

  const datePart = new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${datePart} - ${timePart}`;
};

const formatPrice = (val?: string | number | null): string => {
  if (val === undefined || val === null || val === "") return "0";
  const num = Number(val);
  return isNaN(num) ? String(val) : num.toLocaleString("en-US");
};

const formatPersianPrice = (val?: string | number | null): string => {
  if (val === undefined || val === null || val === "") return "۰";
  const num = Number(val);
  return isNaN(num) ? String(val) : num.toLocaleString("fa-IR");
};

const getBookingStatusMeta = (
  status?: string,
): { label: string; type: "confirmed" | "pending" | "canceled" } => {
  const normalized = (status || "").toLowerCase();
  if (normalized === "confirmed" || normalized === "conformed") {
    return { label: "تایید شده", type: "confirmed" };
  }
  if (normalized === "canceled" || normalized === "cancelled") {
    return { label: "لغو شده", type: "canceled" };
  }
  return { label: "در انتظار تایید", type: "pending" };
};

const calculateProfileCompletion = (
  profile: ISellerDashboardProfile | null,
): number => {
  if (!profile) return 0;
  const checks = [
    Boolean(profile.firstName?.trim()),
    Boolean(profile.lastName?.trim()),
    Boolean(profile.email?.trim()),
    Boolean(profile.phoneNumber?.trim()),
    Boolean(profile.profilePicture),
    Boolean(profile.emailVerified),
  ];
  const filledCount = checks.filter(Boolean).length;
  return Math.round((filledCount / checks.length) * 100);
};

const getLastEditedText = (updatedAt?: string | null): string => {
  if (!updatedAt) return "هنوز ویرایشی ثبت نشده است";
  const date = new Date(updatedAt);
  if (isNaN(date.getTime())) return "بروزرسانی اخیر";

  const diffDays = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays <= 0) return "آخرین ویرایش امروز";
  if (diffDays === 1) return "آخرین ویرایش دیروز";
  return `آخرین ویرایش ${diffDays.toLocaleString("fa-IR")} روز پیش`;
};

const SellerDashboard = () => {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<"month" | "year">("month");

  const { data, isLoading } = useGetSellerDashboard();
  const { mutate: confirmBooking } = useConfirmSellerBooking();
  const { mutate: cancelBooking } = useCancelSellerBooking();
  const { mutate: deleteBooking } = useDeleteSellerBooking();

  const bookings = useMemo(() => data?.bookings ?? [], [data?.bookings]);

  const stats = useMemo(() => {
    const totalHouses = data?.housesTotalCount ?? 0;

    const activeBookings = bookings.filter((b) => {
      const s = (b.status || "").toLowerCase();
      return s === "confirmed" || s === "conformed";
    }).length;

    const pendingBookings = bookings.filter(
      (b) => (b.status || "").toLowerCase() === "pending",
    ).length;

    const todayVisits = data?.todayVisitsCount ?? 0;

    return [
      { icon: Building06Icon, label: "کل ملک ها", value: totalHouses, href },
      {
        icon: ListChecksIcon,
        label: "رزرو های فعال",
        value: activeBookings,
        href,
      },
      {
        icon: HourglassIcon,
        label: "رزرو های در انتظار",
        value: pendingBookings,
        href,
      },
      { icon: ViewIcon, label: "بازدید های امروز", value: todayVisits, href },
    ];
  }, [data?.housesTotalCount, data?.todayVisitsCount, bookings]);

  const incomeMetrics = useMemo(() => {
    const now = new Date();
    const currentMonthName = new Intl.DateTimeFormat("fa-IR", {
      month: "long",
    }).format(now);
    const currentYearText = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
    }).format(now);

    const finance = data?.finance;
    const totalAmount = Number(finance?.totalAmount ?? 0);
    const currentMonthAmount = Number(finance?.totalCurrentMonthAmount ?? 0);

    if (timeframe === "year") {
      const currentGregorianYear = now.getFullYear();
      const paymentsSumThisYear = (data?.payments ?? []).reduce((sum, p) => {
        const dStr =
          p.createdAt || p.booking?.createdAt || p.booking?.created_at;
        const d = dStr ? new Date(dStr) : null;
        if (
          d &&
          !isNaN(d.getTime()) &&
          d.getFullYear() === currentGregorianYear
        ) {
          return sum + (Number(p.amount) || 0);
        }
        return sum;
      }, 0);

      const periodAmount =
        paymentsSumThisYear > 0 ? paymentsSumThisYear : totalAmount;
      const percentage =
        totalAmount > 0
          ? Math.min(100, Math.round((periodAmount / totalAmount) * 100))
          : 0;

      return {
        subtitle: `آمار درآمد سال ${currentYearText}`,
        periodLabel: "درآمد امسال",
        totalAmount,
        periodAmount,
        percentage,
      };
    }

    const percentage =
      totalAmount > 0
        ? Math.min(100, Math.round((currentMonthAmount / totalAmount) * 100))
        : 0;

    return {
      subtitle: `از تاریخ ۱ تا ۳۰ ${currentMonthName} ${currentYearText}`,
      periodLabel: "درآمد این ماه",
      totalAmount,
      periodAmount: currentMonthAmount,
      percentage,
    };
  }, [data?.finance, data?.payments, timeframe]);

  const profileCompletion = useMemo(
    () => calculateProfileCompletion(data?.profile ?? null),
    [data?.profile],
  );

  const lastEditedText = useMemo(
    () =>
      getLastEditedText(
        data?.profile?.updatedAt || data?.profile?.updated_at || null,
      ),
    [data?.profile],
  );

  const recentReservations = useMemo(() => {
    return bookings.slice(0, 8).map((item: ISellerBookingItem) => {
      const firstPhoto =
        Array.isArray(item.house?.photos) && item.house.photos.length > 0
          ? item.house.photos[0]
          : "/images/hotel.jpg";
      const statusMeta = getBookingStatusMeta(item.status);

      return {
        id: String(item.id),
        name:
          item.house?.title ||
          `اقامتگاه شماره ${item.houseId || item.house_id || item.id}`,
        image: firstPhoto || "/images/hotel.jpg",
        date: formatPersianDateTime(
          item.created_at || item.createdAt || item.reservedDates?.[0],
        ),
        price: formatPersianPrice(
          item.amount ??
            item.totalPrice ??
            item.total_price ??
            item.price ??
            item.house?.price,
        ),
        statusLabel: statusMeta.label,
        statusType: statusMeta.type,
      };
    });
  }, [bookings]);

  const getDropDownOptions = (bookingId: string) => [
    {
      label: "تایید رزرو",
      onClick: () => confirmBooking(bookingId),
    },
    {
      label: "لغو رزرو",
      onClick: () => cancelBooking(bookingId),
    },
    {
      label: "جزئیات",
      onClick: () => router.push(`/panel/reservations?bookingId=${bookingId}`),
    },
    {
      label: "حذف",
      onClick: () => deleteBooking(bookingId),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} isLoading={isLoading} />
        ))}
      </div>
      <div className="flex flex-col items-stretch gap-4 xl:flex-row">
        <div className="flex w-full flex-col gap-4 rounded-[24px] bg-default-white-bg p-4 sm:gap-5 sm:p-6 xl:w-1/2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
              <p className="text-base font-bold sm:text-lg xl:text-[20px]">
                نمودار درآمد
              </p>
              <span className="text-sm font-normal text-neutral-dark-200 sm:text-base">
                {incomeMetrics.subtitle}
              </span>
            </div>
            <SelectComponent
              defaultValue="month"
              onChange={(value: string | null) =>
                setTimeframe(value === "year" ? "year" : "month")
              }
              items={items}
              triggerClassName="rounded-[40px] border-neutral-300 w-fit px-3! py-2! h-9! sm:px-4! sm:py-2.5! sm:h-10.5! bg-transparent! text-sm! sm:text-base! font-normal! text-default-text!"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-end">
            {isLoading ? (
              <>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-28" />
                  <Skeleton className="h-12 w-28" />
                </div>
                <Skeleton className="size-28 shrink-0 self-end rounded-full sm:size-32.5" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-neutral-400 sm:size-4" />
                      <span className="text-xs text-neutral-dark-300 sm:text-[14px]">
                        درآمد کل
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-normal text-default-text sm:gap-2 sm:text-[14px]">
                      <p>{formatPrice(incomeMetrics.totalAmount)}</p>
                      <p>تومان</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-primary-600 sm:size-4" />
                      <span className="text-xs text-neutral-dark-300 sm:text-[14px]">
                        {incomeMetrics.periodLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-normal text-default-text sm:gap-2 sm:text-[14px]">
                      <p>{formatPrice(incomeMetrics.periodAmount)}</p>
                      <p>تومان</p>
                    </div>
                  </div>
                </div>
                <div className="size-28 shrink-0 self-end sm:size-32.5">
                  <CircularProgressbar
                    value={incomeMetrics.percentage}
                    text={`${incomeMetrics.percentage}%`}
                    strokeWidth={12}
                    styles={progressStyles}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-[24px] bg-default-white-bg p-4 sm:gap-5 sm:p-6 xl:w-1/2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
              <p className="text-base font-bold sm:text-lg xl:text-[20px]">
                نمودار تکمیل پروفایل
              </p>
              <span className="text-sm font-normal text-neutral-dark-200 sm:text-base">
                پروفایل باید حداقل ۷۰٪ تکمیل شده باشد.
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/panel/buyer/profile")}
              className="w-fit rounded-[40px] border-neutral-300 px-3! py-2! h-9! sm:px-4! sm:py-2.5! sm:h-10.5! bg-transparent! text-sm! sm:text-base! font-normal! text-default-text! hover:border-primary-800 hover:text-primary-800"
            >
              ویرایش پروفایل
            </Button>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-end">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="size-28 shrink-0 self-end rounded-full sm:size-32.5" />
              </>
            ) : (
              <>
                <p className="text-xs font-normal text-neutral-dark-200 sm:text-sm xl:text-[14px]">
                  {lastEditedText}
                </p>
                <div className="size-28 shrink-0 self-end sm:size-32.5">
                  <CircularProgressbar
                    value={profileCompletion}
                    text={`${profileCompletion}%`}
                    strokeWidth={12}
                    styles={progressStyles}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-[24px] bg-default-white-bg p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="truncate text-lg font-bold text-default-text sm:text-[20px]">
            رزرو های اخیر مشتریان
          </h2>
          <Link
            href="/panel/reserveManagement/seller"
            className="shrink-0 text-sm font-normal text-neutral-dark-200 sm:text-base"
          >
            مشاهده همه
          </Link>
        </div>
        <div className="max-h-65 overflow-x-auto overflow-y-auto scrollbar-hide [-ms-overflow-style:none] scrollbar-width:none [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-160 text-xs sm:min-w-170 sm:text-sm">
            <thead className="sticky top-0 z-10 bg-default-white-bg">
              <tr className="text-right text-gray-700">
                <th className="py-3 font-bold text-sm text-default-text sm:text-base">
                  نام اقامتگاه
                </th>
                <th className="py-3 font-bold text-sm text-default-text sm:text-base">
                  تاریخ رزرو
                </th>
                <th className="py-3 font-bold text-sm text-default-text sm:text-base">
                  قیمت
                </th>
                <th className="py-3 font-bold text-sm text-default-text sm:text-base">
                  وضعیت
                </th>
                <th className="py-3 text-left font-bold text-sm text-default-text sm:text-base">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="border-t border-neutral-300">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-8 rounded-full" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-7 w-20 rounded-[8px]" />
                    </td>
                    <td className="py-3 pl-3">
                      <Skeleton className="mr-auto size-6 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : recentReservations.length === 0 ? (
                <tr className="border-t border-neutral-300">
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                  >
                    رزروی یافت نشد
                  </td>
                </tr>
              ) : (
                recentReservations.map((item) => (
                  <tr key={item.id} className="border-t border-neutral-300">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <ImageFallback
                          src={item.image}
                          alt={item.name}
                          className="size-8 shrink-0 rounded-full object-cover"
                          width={32}
                          height={32}
                        />
                        <span className="truncate text-sm font-normal text-default-text sm:text-base">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm font-normal text-default-text sm:text-base">
                      {item.date}
                    </td>
                    <td className="py-3 text-sm font-normal text-default-text sm:text-base">
                      {item.price} <span className="mr-1">تومان</span>
                    </td>
                    <td className="py-3">
                      <Badge text={item.statusLabel} type={item.statusType} />
                    </td>
                    <td className="flex justify-end py-3 pl-3">
                      <DropDownMenu
                        triggerRender={
                          <HugeiconsIcon
                            icon={EllipsisVerticalIcon}
                            className="size-5 cursor-pointer text-default-black sm:size-6"
                          />
                        }
                        dropDownItems={getDropDownOptions(item.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
