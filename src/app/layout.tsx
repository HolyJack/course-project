import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { NavMenu } from "@/components/NavMenu";
import Providers from "@/shared/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <header
            className="bg-background/60 text-text shadow-shadow sticky top-0 z-[1000]
              flex h-20 w-full items-center px-4 py-5 shadow backdrop-blur-md"
          >
            <NavMenu />
          </header>
          <main>
            <div className="bg-background relative px-4">
              <div className="container mx-auto flex h-full min-h-[calc(100vh-5rem)] py-5">
                {children}
              </div>
            </div>
          </main>
          <footer></footer>
        </Providers>
      </body>
    </html>
  );
}
