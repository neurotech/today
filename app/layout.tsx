import type { Metadata } from "next";
import { EB_Garamond, Hanken_Grotesk } from "next/font/google";
import { HorizontalRule } from "@/components/HorizontalRule";
import { Clock } from "@/features/Clock/Clock";
import { TabBar } from "@/features/Tabs/TabBar";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Today",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${ebGaramond.variable}`}
    >
      <body className="font-display flex flex-col h-screen bg-velvet-1100 text-velvet-600 selection:bg-velvet-300 selection:text-velvet-900">
        <header className="flex flex-row justify-between items-center font-bold p-2 bg-velvet-1000">
          <h1 className="text-velvet-500 text-shadow-black/30 text-shadow-2xs font-logo text-2xl font-normal select-none tracking-tighter">
            Today
          </h1>
          <TabBar />
          <Clock />
        </header>

        <HorizontalRule />

        <main className="relative flex flex-col flex-1 overflow-y-auto p-2">
          {children}
        </main>
      </body>
    </html>
  );
}
