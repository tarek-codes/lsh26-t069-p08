import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";

export const metadata: Metadata = {
  title: "School Result Processing and GPA Engine",
  description: "Deterministic GPA calculation engine and administrative audit dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900 font-sans min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
