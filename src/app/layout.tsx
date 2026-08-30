import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
