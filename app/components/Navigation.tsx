"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  
  const links = [
    { name: "HOME", href: "/" },          // エントランスに戻る
    { name: "ITEM", href: "/store" },     // 商品一覧へ
    { name: "CONCEPT", href: "/concept" },// コンセプトへ
    
  ];
  
  // InstagramのURL
  const instagramUrl = "https://www.instagram.com/unsungstar_official?igsh=NDg0ZjVqbWs0ejY3";

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-8 left-8 z-50 flex flex-col justify-center items-center w-10 h-10 space-y-2 group mix-blend-difference"
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
          className="w-8 h-0.5 bg-white block transition-transform"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="w-8 h-0.5 bg-white block transition-opacity"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
          className="w-8 h-0.5 bg-white block transition-transform"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col space-y-8 text-center">
              
              {/* 内部リンク（HOME, ITEM, CONCEPT） */}
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={toggleMenu}
                  className="text-3xl md:text-5xl font-serif tracking-widest text-white hover:text-gray-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              {/* Instagramリンク（外部サイト） */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={toggleMenu}
                className="text-3xl md:text-5xl font-serif tracking-widest text-white hover:text-gray-400 transition-colors"
              >
                INSTAGRAM
              </a>

            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}