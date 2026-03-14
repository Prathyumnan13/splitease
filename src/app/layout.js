import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/bottom-nav";
import { getSession } from "@/lib/session";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SplitEase — Home Expense Splitter",
  description: "Split home maintenance expenses with your housemates",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
        {session && <BottomNav userName={session.name} />}
        <main className={`min-h-screen ${session ? "pb-20 sm:pb-4" : ""}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
