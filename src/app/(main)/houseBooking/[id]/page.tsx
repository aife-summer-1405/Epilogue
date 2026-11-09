
import { Suspense } from "react";
import HouseBookingContent from "./HouseBookingContent";

export default function HouseBookingPage() {
  return (
    <Suspense
      fallback={
        <main
          dir="rtl"
          className="min-h-screen p-6"
        >
          در حال بارگذاری صفحه رزرو...
        </main>
      }
    >
      <HouseBookingContent />
    </Suspense>
  );
}
