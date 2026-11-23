import { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import AddPayment from "../AddPayment";

export const metadata: Metadata = {
  title: "پرداخت",
};

interface IProps {
  params: Promise<{ bookingId: string }>;
}

const PaymentContent = async ({ params }: IProps) => {
  await connection();

  const { bookingId } = await params;

  return <AddPayment bookingId={bookingId} />;
};

const DashboardPaymentPage = ({ params }: IProps) => {
  return (
    <Suspense fallback={<div>در حال بارگذاری اطلاعات پرداخت...</div>}>
      <PaymentContent params={params} />
    </Suspense>
  );
};

export default DashboardPaymentPage;
