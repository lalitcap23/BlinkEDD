import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Solana Universal Payment Links | BlinkEDD",
  description: "Create universal Solana payment links that work seamlessly across all devices, wallets, and platforms. Perfect for meetups, social media, and instant payments.",
  keywords: "Solana, payment links, crypto payments, universal links, blockchain, meetups, social media payments",
  authors: [{ name: "BlinkEDD Team" }],
  openGraph: {
    title: "Solana Universal Payment Links | BlinkEDD",
    description: "Create universal Solana payment links that work seamlessly across all devices, wallets, and platforms.",
    type: "website",
    url: "https://blinked-two.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Universal Payment Links | BlinkEDD",
    description: "Create universal Solana payment links that work seamlessly across all devices, wallets, and platforms.",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}