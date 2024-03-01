import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Providers } from "@/app/redux/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog ",
  description: "A blog web where users can read and write posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <div className="container bg-[#f2f2f2] w-screen mx-auto">
            <Header />
            {children}
            <Footer />
          </div>
        </body>
      </html>
    </Providers>
  );
}
