"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnalyticsUpIcon, Pulse01Icon } from "@hugeicons/core-free-icons"; import { AdminDashboardStats } from "@/core/types/dashboard.types";
import { RadialProgressRing } from "@/components/atoms/RadialProgressRing";

interface DashboardInsightsGridProps {
    stats: AdminDashboardStats;
}

export function DashboardInsightsGrid({ stats }: DashboardInsightsGridProps) {
    const userToBookingRatio =
        stats.totalUsers > 0 ? Math.min(100, (stats.totalBookings / stats.totalUsers) * 100) : 0;

    const houseToUserRatio =
        stats.totalUsers > 0 ? Math.min(100, (stats.totalHouses / stats.totalUsers) * 100) : 0;

    const insights = [
        {
            title: "نسبت رزرو به کاربران",
            description: `از مجموع ${new Intl.NumberFormat("fa-IR").format(stats.totalUsers)} کاربر، ${new Intl.NumberFormat("fa-IR").format(stats.totalBookings)} رزرو ثبت شده است.`,
            percent: userToBookingRatio,
            strokeClass: "stroke-secondary-500 dark:stroke-secondary-400",
            icon: AnalyticsUpIcon,
        },
        {
            title: "تراکم اقامتگاه نسبت به کاربران",
            description: `${new Intl.NumberFormat("fa-IR").format(stats.totalHouses)} اقامتگاه فعال در برابر ${new Intl.NumberFormat("fa-IR").format(stats.totalUsers)} کاربر سامانه.`,
            percent: houseToUserRatio,
            strokeClass: "stroke-primary-500 dark:stroke-primary-200",
            icon: Pulse01Icon,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {insights.map((item, idx) => {
                const Icon = item.icon;
                return (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.4 + idx * 0.1 }}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-sm"
                    >
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <HugeiconsIcon
                                    icon={item.icon}
                                    size={16}
                                    color="currentColor"
                                    strokeWidth={1.8}
                                    className="text-primary-500 dark:text-primary-200"
                                />                <h4 className="text-sm font-bold text-default-text">{item.title}</h4>
                            </div>
                            <p className="text-xs leading-relaxed text-neutral-800 dark:text-neutral-600">
                                {item.description}
                            </p>
                        </div>

                        <RadialProgressRing
                            percentage={item.percent}
                            size={84}
                            strokeWidth={8}
                            strokeColorClass={item.strokeClass}
                        >
                            <span className="text-xs font-extrabold text-default-text">
                                {new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(
                                    item.percent
                                )}
                                ٪
                            </span>
                        </RadialProgressRing>
                    </motion.div>
                );
            })}
        </div>
    );
}