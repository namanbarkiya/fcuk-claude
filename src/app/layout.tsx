import type { Metadata } from "next";
import { Geist, Geist_Mono, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "fcuk claude - where devs go to scream",
  description:
    "Rate limited again? Code deleted? Production down? Join thousands of devs rage-posting about Claude AI. The wall of shame Anthropic doesn't want you to see.",
  keywords: [
    "claude ai",
    "claude complaints",
    "claude rate limit",
    "claude code",
    "anthropic",
    "ai frustration",
    "developer rage",
    "claude sucks",
    "claude down",
  ],
  openGraph: {
    title: "fcuk claude",
    description:
      "The unofficial wall where devs tell Claude exactly what they think. Rate limits, hallucinations, deleted code. All the rage, none of the apologies.",
    type: "website",
    siteName: "fcuk claude",
    images: [{ url: "https://res.cloudinary.com/dvt5vkfwz/image/upload/v1774350760/fcuk_claude_og_tpgkxf.jpg", width: 1200, height: 630, alt: "fcuk claude" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "fcuk claude - where devs go to scream",
    description:
      "Rate limited again? Code deleted? Join the rage. The wall of shame Anthropic doesn't want you to see.",
    images: ["https://res.cloudinary.com/dvt5vkfwz/image/upload/v1774350760/fcuk_claude_og_tpgkxf.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${libreBaskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
