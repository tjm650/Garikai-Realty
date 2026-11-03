import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "./components/navigation/NavigationBar";
import Footer from "./components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Garikai Realty | Reliable and Secure accommodation search",
  // description: "Accommodation assistant",

  icons: {
    icon: [{ url: "/garikai-favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/garikai-favicon.svg"],
    apple: [{ url: "/garikai-favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  minimumScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased leading-3 overflow-x-hidden`}
      >
        <NavigationBar />
        <main className="min-h-screen bg-[#f7f2e8]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
