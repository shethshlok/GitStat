import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitStat | The New Standard of Engineering Impact",
  description: "Track commits, additions, and deletions from your Mac menu bar. Turn raw code into real clout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020408] text-[#e2e8f0] font-space selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
