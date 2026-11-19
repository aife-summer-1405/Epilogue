import { EditHouseFormOrganism } from "@/components/organisms/EditHouse/EditHouseFormOrganism";


interface EditHousePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditHousePage({ params }: EditHousePageProps) {
  const { id } = await params;

  return (
    <main dir="rtl" className="min-h-screen ">
        <EditHouseFormOrganism houseId={id} />
    </main>
  );
}