import { EditHouseFormOrganism } from "@/components/organisms/EditHouse/EditHouseFormOrganism";


interface EditHousePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditHousePage({ params }: EditHousePageProps) {
  const { id } = await params;

  return (
    <main dir="rtl" className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <EditHouseFormOrganism houseId={id} />
      </div>
    </main>
  );
}