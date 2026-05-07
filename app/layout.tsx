import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartProvider";

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  variable: "--font-readex",
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "قهوتك المختصة | التجربة الأمثل",
  description: "استمتع بأجود أنواع الإسبريسو والقهوة التركية في تجربة فريدة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${readexPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDFCFB] text-[#2D241E] font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
