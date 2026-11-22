import { PaymentsManagementTemplate } from "@/components/templates/PaymentsManagementTemplate";

interface AdminPaymentsPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    userId?: string;
    amount?: string;
    order?: "ASC" | "DESC";
  }>;
}

export default async function AdminPaymentsPage({ searchParams }: AdminPaymentsPageProps) {
  const params = await searchParams;

  return (
    <PaymentsManagementTemplate
      initialFilters={{
        page: Number(params.page) || 1,
        limit: 10,
        sort: "createdAt",
        order: params.order || "DESC",
        status: params.status || "all",
        userId: params.userId || "",
        amount: params.amount || "",
      }}
    />
  );
}