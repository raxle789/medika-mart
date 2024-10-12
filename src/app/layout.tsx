import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/redux/provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedikaMart",
  description:
    "Medika Mart is an online shop that provides various health equipment, from blood pressure measuring devices to sports equipment. We help you live healthier and more comfortably.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth scroll-pt-[70px]">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${inter.className} antialiased bg-[#f7f7f7]`}
      >
        <Providers>
          <main>{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
