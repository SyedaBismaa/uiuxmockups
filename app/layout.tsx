import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "Uiux Mock Generator",
  description: "Ai Uiux Mock generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
      >
        <Provider>
          {children}
        </Provider>
        <Toaster position="top-right" />
      </body>
    </html>
    </ClerkProvider>
  );
}
