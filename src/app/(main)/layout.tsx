import Footer from "@/components/organisms/common/Footer";
import Header from "@/components/organisms/common/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-12 min-h-screen bg-default-white-bg">
      <Header isLoggedIn={false} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
