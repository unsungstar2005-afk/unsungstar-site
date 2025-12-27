"use client";

import Image from "next/image";
import { motion } from "framer-motion";
// ▼ 星空コンポーネントを読み込み（パスは環境に合わせて調整してください）
import StarBackground from "../components/StarBackground";

export default function ConceptPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 1.2, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  return (
    // ▼ relative と overflow-hidden を追加
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center pt-48 px-8 pb-20 relative overflow-hidden">
      
      {/* ▼▼▼ 追加：星空背景 ▼▼▼ */}
      <StarBackground />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // ▼ relative z-10 を追加して、星より手前に表示
        className="max-w-2xl text-center tracking-widest leading-loose font-medium flex flex-col items-center relative z-10"
      >
        {/* 1段落目 */}
        <motion.p variants={itemVariants} className="mb-16 text-sm md:text-base text-gray-300">
          縁の下の力持ちを意味する<br />
          「UNSUNG HERO」から着想を得た<br />
          <span className="text-white">「UNSUNG」</span>
        </motion.p>

        {/* 2段落目 */}
        <motion.p variants={itemVariants} className="mb-16 text-sm md:text-base text-gray-300">
          LOGOはHEROを意味する星型に<br />
          「UNSUNG」を
        </motion.p>

        {/* 3段落目 */}
        {/* z-10を指定しているので、ロゴが重なっても文字が上に浮き出ます */}
        <motion.p variants={itemVariants} className="text-sm md:text-base text-gray-300 mb-0 relative z-10">
          表舞台に立たずとも日々を<br />
          懸命に生きる<br />
          <span className="text-white">&quot;誰か&quot;</span> にこそ光を当てるブランド
        </motion.p>

        {/* 最後に現れるロゴ */}
        {/* ▼▼▼ -mt-48 に変更！これでかなり食い込みます ▼▼▼ */}
        <motion.div variants={itemVariants} className="-mt-48 relative z-0 opacity-80">
           <Image
             src="/logo.png"
             alt="UNSUNG STAR Logo"
             width={600}
             height={300}
             className="object-contain"
           />
        </motion.div>

      </motion.div>
    </div>
  );
}