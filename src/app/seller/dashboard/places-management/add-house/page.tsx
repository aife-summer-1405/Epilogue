import { AddHouseFormOrganism } from "@/components/organisms/AddHouse/AddHouseFormOrganism";

export default function AddHousePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <AddHouseFormOrganism />
      </div>
    </main>
  );
}