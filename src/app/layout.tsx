import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow | Modern Task Management",
  description: "A premium task board system built with Next.js, Prisma, and Tailwind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen pt-16`}>
        <Navbar />
        <main className="container mx-auto p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
