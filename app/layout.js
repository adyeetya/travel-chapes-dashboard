import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Travel Chapes - Admin Dashboard",
  description: "Manage your travel packages, trips, and bookings with Travel Chapes admin dashboard",
  keywords: "travel, admin dashboard, trip management, travel packages, bookings",
  authors: [{ name: "Travel Chapes" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><Navbar />
        {children}
      </body>
    </html>
  );
}