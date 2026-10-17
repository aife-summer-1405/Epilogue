import Footer from "@/components/organisms/common/Footer";
import Header from "@/components/organisms/common/Header";


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn={false} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}