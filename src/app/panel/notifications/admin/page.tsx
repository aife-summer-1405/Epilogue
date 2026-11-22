import { getNotificationsAction } from "@/app/actions/admin/notifications";
import { NotificationsClient } from "@/components/organisms/notifications/NotificationsClient";
import { NotificationsFilters } from "@/core/types/notification";


interface NotificationsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    userId?: string;
    type?: string;
    isRead?: string;
    search?: string;
  }>;
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const resolvedParams = await searchParams;

  const initialFilters: NotificationsFilters = {
    page: Math.max(1, Number(resolvedParams.page) || 1),
    limit: Math.max(1, Number(resolvedParams.limit) || 10),
    userId: resolvedParams.userId || "",
    type: resolvedParams.type || "all",
    isRead:
      resolvedParams.isRead === "read" || resolvedParams.isRead === "unread"
        ? resolvedParams.isRead
        : "all",
    search: resolvedParams.search || "",
  };

  const result = await getNotificationsAction(initialFilters);

  return (
    <section className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-extrabold text-default-text">
          مدیریت اعلانات
        </h1>
      </div>

      <NotificationsClient
        initialData={result.data}
        initialFilters={initialFilters}
      />
    </section>
  );
}