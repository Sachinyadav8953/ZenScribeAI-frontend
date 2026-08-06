import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "../components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Doctor_zenZ - Ambient Medical Scribe",
  description: "AI-powered ambient medical scribe for Indian doctors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#0F172A] dark:bg-[#0f172a] dark:text-[#f8fafc]">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
