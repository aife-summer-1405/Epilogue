import { Suspense } from "react";
import HouseDetailContent from "./HouseDetailContent";

interface HouseRentPageProps {
  params: Promise<{
    id: string;
  }>;
}
export default function HouseRentDetailPage({ params }: HouseRentPageProps) {
  return (
    <main className="mx-auto w-full  px-4 py-6 sm:px-6 lg:px-20">
      <Suspense
        fallback={
          <div className="flex h-[60vh] items-center justify-center">
            <p className="text-neutral-500">در حال بارگذاری صفحه...</p>
          </div>
        }
      >
        <HouseDetailWrapper params={params} />
      </Suspense>
    </main>
  );
}
async function HouseDetailWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HouseDetailContent id={id} />;
}
