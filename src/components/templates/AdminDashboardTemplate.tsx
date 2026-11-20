"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    UserMultiple02Icon,
    Home01Icon,
    CalendarCheckIn01Icon,
    StarIcon,
    RefreshIcon,
} from "@hugeicons/core-free-icons"; import { AdminDashboardStats } from "@/core/types/dashboard.types";
import { StatKpiCard } from "@/components/molecules/StatKpiCard";
import { RatingGaugeCard } from "@/components/molecules/RatingGaugeCard";
import { DashboardOverviewChart } from "@/components/organisms/DashboardOverviewChart";
import { DashboardInsightsGrid } from "@/components/organisms/DashboardInsightsGrid";

interface AdminDashboardTemplateProps {
    stats: AdminDashboardStats;
}

export function AdminDashboardTemplate({ stats }: AdminDashboardTemplateProps) {
    const numericRating = parseFloat(stats.averageRating) || 0;
    const maxEntity = Math.max(stats.totalUsers, stats.totalHouses, stats.totalBookings, 1);

    return (
        <section dir="rtl" className="w-full space-y-6 p-4 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
                        نمای کلی مدیریت سامانه
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
                        گزارش لحظه‌ای کاربران، اقامتگاه‌ها، رزروها و امتیاز رضایت مهمانان
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content px-3.5 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-700">
                    <HugeiconsIcon
                        icon={RefreshIcon}
                        size={14}
                        color="currentColor"
                        strokeWidth={2}
                        className="text-success-600 dark:text-success-500 animate-spin [animation-duration:8s]"
                    />          <span>وضعیت سامانه: فعال</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatKpiCard
                    index={0}
                    title="تعداد کل کاربران"
                    subtitle="سهم از بیشترین شاخص"
                    value={stats.totalUsers}
                    unitLabel="کاربر"
                    icon={UserMultiple02Icon}
                    variant="primary"
                    progressPercent={(stats.totalUsers / maxEntity) * 100}
                />

                <StatKpiCard
                    index={1}
                    title="تعداد کل اقامتگاه‌ها"
                    subtitle="نسبت به کل کاربران"
                    value={stats.totalHouses}
                    unitLabel="اقامتگاه"
                    icon={Home01Icon}
                    variant="success"
                    progressPercent={(stats.totalHouses / maxEntity) * 100}
                />

                <StatKpiCard
                    index={2}
                    title="تعداد کل رزروها"
                    subtitle="نسبت به کل کاربران"
                    value={stats.totalBookings}
                    unitLabel="رزرو"
                    icon={CalendarCheckIn01Icon}
                    variant="secondary"
                    progressPercent={(stats.totalBookings / maxEntity) * 100}
                />

                <StatKpiCard
                    index={3}
                    title="میانگین امتیازات"
                    subtitle="از سقف ۵ امتیاز"
                    value={numericRating}
                    unitLabel="از ۵"
                    icon={StarIcon}
                    variant="warning"
                    progressPercent={(numericRating / 5) * 100}
                />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <DashboardOverviewChart stats={stats} />
                </div>
                <div className="lg:col-span-4">
                    <RatingGaugeCard averageRating={stats.averageRating} />
                </div>
            </div>

            <DashboardInsightsGrid stats={stats} />
        </section>
    );
}