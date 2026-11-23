import { getSellerUpgradeRequestsAction } from "@/app/actions/admin/seller-upgrade.actions";
import { SellerUpgradeRequestsTemplate } from "@/components/templates/SellerUpgradeRequestsTemplate";

export default async function SellerUpgradeRequestsPage() {
  const initialData = await getSellerUpgradeRequestsAction({
    status: "pending",
    page: 1,
    limit: 10,
  }).catch(() => undefined);

  return <SellerUpgradeRequestsTemplate initialData={initialData} />;
}