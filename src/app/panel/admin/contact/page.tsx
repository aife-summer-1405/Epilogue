import { Suspense } from "react";
import { getContactMessagesAction } from "@/app/actions/admin/contactUs.actions";
import { ContactUsManagementContent } from "@/components/organisms/ContactUsManagementContent";

async function ContactUsInitialLoader() {
  const initialData = await getContactMessagesAction({
    page: 1,
    limit: 10,
    sort: "id",
    order: "DESC",
  }).catch(() => undefined);

  return <ContactUsManagementContent initialData={initialData} />;
}

export default function AdminContactUsPage() {
  return (
    <Suspense
      fallback={
        <div dir="rtl" className="w-full space-y-6 p-4 sm:p-6">
          <div className="h-14 w-64 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-50" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content"
              />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content" />
        </div>
      }
    >
      <ContactUsInitialLoader />
    </Suspense>
  );
}