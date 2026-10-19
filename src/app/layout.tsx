import "./globals.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/providers/DarkModeProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Bounce, ToastContainer } from "react-toastify";
import localFont from "next/font/local";
import { TooltipProvider } from "@/components/ui/tooltip";

const vazirmatn = localFont({
  src: [
    {
      path: "./assets/fonts/Vazirmatn-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./assets/fonts/Vazirmatn-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./assets/fonts/Vazirmatn-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/fonts/Vazirmatn-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/fonts/Vazirmatn-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/fonts/Vazirmatn-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./assets/fonts/Vazirmatn-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/fonts/Vazirmatn-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./assets/fonts/Vazirmatn-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", vazirmatn.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              rtl
              closeOnClick={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              transition={Bounce}
              stacked
              toastStyle={{
                fontFamily: "var(--font-primary), sans-serif",
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
