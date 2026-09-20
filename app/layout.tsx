import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import DiscoverSidebar from "@/components/DiscoverSidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FretTalk",
  description: "ギター練習ログを記録してシェアするアプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-50 dark:bg-neutral-950">
        <Header />
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row">
          <BottomNav />
          <main className="order-1 mx-auto w-full max-w-lg flex-1 px-4 py-4 md:order-2 md:max-w-2xl md:px-8 md:py-8">
            {children}
          </main>
          <DiscoverSidebar />
        </div>
      </body>
    </html>
  );
}
