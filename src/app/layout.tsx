import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const ws = Work_Sans({
  weight: ['300', '400', '500', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
    shortcut: [{ url: '/favicon.ico' }]
  },
  title: "SentinelSift | Cognitive Community Analysis Suite",
  description: "Neuro-symbolic sentiment analyzer powered by OpenAI GPT-4o and Hugging Face models for real-time community pattern tracking. Protect digital ecosystems with adaptive anomaly detection and FTC-compliant truth-in-advertising analysis.",
  keywords: [
    "sentiment analysis",
    "AI community monitoring",
    "cognitive dissonance detection",
    "Reddit sentiment tracker",
    "OpenAI GPT-4 integration",
    "Hugging Face NLP models",
    "encrypted API security"
  ],
  authors: [{ name: "Ahmed Amin Jidar", url: "https://github.com/ahmedjidar" }],
  openGraph: {
    type: "website",
    url: "https://sentinelsift.vercel.app/",
    title: "SentinelSift - Cognitive Community Analyzer",
    description: "AI-powered sentiment radar for digital community ecosystems",
    siteName: "SentinelSift",
    images: [{
      url: "/og-banner.png",
      width: 1200,
      height: 630,
      alt: "SentinelSift Neural Analysis Interface",
    }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ws.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
