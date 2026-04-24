import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoachChat from "@/components/CoachChat";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "AISRI Coach - AI-Powered Performance Coaching",
  description:
    "Train smarter. Run faster. Real-time AISRI scoring, biomechanics analysis, and adaptive training.",
  keywords: [
    "running",
    "training",
    "coaching",
    "biomechanics",
    "injury prevention",
    "performance",
  ],
  authors: [{ name: "AISRI Coach" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aisricoach.com",
    title: "AISRI Coach - AI-Powered Performance Coaching",
    description: "Train smarter. Run faster.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1020",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dark-950 text-gray-100">
        <AuthProvider>
          <Navbar />
          <div className="pt-16 min-h-screen">{children}</div>
          <Footer />
          <CoachChat />
        </AuthProvider>
      </body>
    </html>
  );
}