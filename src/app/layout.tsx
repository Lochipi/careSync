import "~/styles/globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { Toaster } from "~/components/ui/sonner";

import { ourFileRouter } from "~/app/api/uploadthing/core";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import DashboardLayout from "./_components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "CareSync",
  description: "A simple and easy to use care management system",
  authors: [{ name: "CareSync" }],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <DashboardLayout>
          <NextSSRPlugin
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </DashboardLayout>
      </body>
    </html>
  );
}
