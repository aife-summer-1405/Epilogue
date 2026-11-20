import { getAdminUserByIdAction } from "@/app/actions/admin/users.action";
import { EditUserTemplate } from "@/components/templates/EditUserTemplate";


interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const response = await getAdminUserByIdAction(id);

  return (
    <EditUserTemplate
      userId={id}
      initialUser={response.success ? response.data : undefined}
    />
  );
}