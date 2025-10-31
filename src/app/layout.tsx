import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/custom/Header";
import { getGlobalPageData, getGlobalPageMetaData } from "@/data/loaders";
import { Footer } from "@/components/custom/Footer";
import { promises } from "dns";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getGlobalPageMetaData();
  return {
    title: metadata?.title,
    description: metadata?.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalData = await getGlobalPageData();
  const headerData = globalData.header;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="bottom-center" />
        <Header data={headerData} />
        {children}
        <Footer data={globalData.footer} />
      </body>
    </html>
  );
}
