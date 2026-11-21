import { AdminDashboardTemplate } from "@/components/templates/AdminDashboardTemplate";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { getAdminDashboardStatsAction } from "@/app/actions/admin/getDashboardStats.action";


export default async function AdminDashboardPage() {
  const response = await getAdminDashboardStatsAction();

  if (!response.success || !response.data) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[55vh] w-full items-center justify-center p-4 sm:p-6"
      >
        <div className="max-w-md w-full rounded-2xl border border-danger-300 dark:border-danger-700 bg-danger-50 dark:bg-danger-900/30 p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-danger-100 dark:bg-danger-800/50 text-danger-600 dark:text-danger-400">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              size={24}
              color="currentColor"
              strokeWidth={1.8}
            />
          </div>
          <h2 className="text-base font-bold text-danger-800 dark:text-danger-300">
            خطا در دریافت اطلاعات داشبورد
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-danger-700 dark:text-danger-400">
            {response.message || "ارتباط با سرور برقرار نشد."}
          </p>
        </div>
      </div>
    );
  }

  return <AdminDashboardTemplate stats={response.data} />;
}