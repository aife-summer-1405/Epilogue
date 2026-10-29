import Footer from "@/components/organisms/common/Footer";
import Header from "@/components/organisms/common/Header";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col gap-12">
      <Suspense fallback={null}>
        <Header isLoggedIn={false} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
