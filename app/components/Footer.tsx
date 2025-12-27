// components/Footer.tsx
"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12 px-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm tracking-widest relative z-50">
      
      {/* 左側のリンク群 */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12 mb-6 md:mb-0 text-center md:text-left">
        <a
          href="https://unsungstar.official.ec/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors cursor-pointer"
        >
          プライバシーポリシー
        </a>
        <a
          href="https://unsungstar.official.ec/law"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors cursor-pointer"
        >
          特定商取引法に基づく表記
        </a>
      </div>

      {/* 右側のコピーライト */}
      <div className="text-white">
        © unsungstar
      </div>
    </footer>
  );
}