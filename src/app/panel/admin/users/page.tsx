import { getAdminUsersAction } from "@/app/actions/admin/users.action";
import { UserManagementTemplate } from "@/components/templates/UserManagementTemplate";


export default async function AdminUsersPage() {
  const response = await getAdminUsersAction();

  return (
    <UserManagementTemplate
      initialData={response.success ? response.data : undefined}
    />
  );
}