import type { Metadata } from "next";
// メニュー部品
import Navigation from "./components/Navigation";
// ：カートボタン部品
import CartButton from "./components/CartButton"; 
import "./globals.css";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "UNSUNG STAR",
  description: "Official Online Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {/* 左上のメニュー */}
        <Navigation />

        {/* 右上のカートボタン */}
        <CartButton />
        
        {children}
        {/* ：最下部のフッター  */}
        <Footer />
      </body>
    </html>
  );
}