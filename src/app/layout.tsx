"use client";

import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/navbar";

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="pt">
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 bg-background">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
