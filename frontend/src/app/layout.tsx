import type { Metadata } from "next";
import { Inter, Noto_Sans_Lao } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/AppLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansLao = Noto_Sans_Lao({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["lao"], 
  variable: "--font-lao" 
});

export const metadata: Metadata = {
  title: "LAO AI INVESTMENT OS",
  description: "AI Investment Decision Support Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lo" className="dark">
      <body className={`${inter.variable} ${notoSansLao.variable} font-lao min-h-screen antialiased`}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
