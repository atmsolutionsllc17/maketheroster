import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ChatWidget } from "@/components/chat-widget";
import { chatbotEnabled } from "@/lib/chatbot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face for headings, the wordmark, and stat figures.
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Make The Roster — Get recruited",
  description:
    "A recruiting network where student-athletes build verified profiles and coaches discover talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        {chatbotEnabled() && <ChatWidget />}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
