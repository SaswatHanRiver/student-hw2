import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header/app-header";
import { Providers } from "./providers";
import "@/styles/style.scss";

export const metadata: Metadata = {
  title: "Students | Riverside Academy Admin",
  description: "AI Frontend Training - Homework 2 (Students: list, create, details, edit, delete)",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Root layout: header + client providers (TanStack Query, toasts) around every page
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
