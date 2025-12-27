"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import DraggableLogo from "./components/DraggableLogo";

// 型定義 
type Ray = {
  id: number;
  angle: number;
  width: number;
  length: number;
  delay: number;
  duration: number;
  opacity: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
};

type Star = {
  id: number;
  top: number;
  left: number;
  size: number;
  baseOpacity: number;
  duration: number;
};

export default function Entrance() {
  const linkStyle = "text-3xl md:text-4xl font-black italic tracking-wider hover:text-gray-400 transition-colors uppercase cursor-pointer z-20";

  const [rays, setRays] = useState<Ray[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [stars, setStars] = useState<Star[]>([]);

  //  1. データの生成（useEffect） 
  useEffect(() => {
    // --- 光の柱：上からロゴ付近まで ---
    const numRays = 15; 
    const allRays: Ray[] = [];
    
    for (let i = 0; i < numRays; i++) {
      // 角度：中央に向かうように少しランダムに
      const angle = (Math.random() * 12 - 6); 
      
      allRays.push({
        id: i,
        angle: angle,
        width: Math.random() * 50 + 20, // 太さ
        // 長さ：画面の半分（45vh〜55vh）付近で止める＝ロゴ付近
        length: Math.random() * 10 + 45, 
        delay: Math.random() * 2, // 15秒後の開始からさらに数秒ずらす
        duration: Math.random() * 2 + 3, // 伸びる速さ
        opacity: Math.random() * 0.4 + 0.3, // 透明度
      });
    }
    setRays(allRays);

    // --- 塵（Particles） ---
    const numParticles = 80;
    const newParticles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, 
        y: Math.random() * 60, // 上半分（光の中）に舞わせる
        size: Math.random() * 2 + 0.5,
        duration: Math.random() * 10 + 5,
      });
    }
    setParticles(newParticles);

    // --- 星空（Stars） ---
    const numStars = 100;
    const newStars: Star[] = [];
    for (let i = 0; i < numStars; i++) {
      newStars.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        baseOpacity: Math.random() * 0.4 + 0.1,
        duration: Math.random() * 3 + 2,
      });
    }
    setStars(newStars);
  }, []);


  // ▼▼▼ 2. アニメーション設定 ▼▼▼
  
  const rayVariants = {
    hidden: { 
      opacity: 0, 
      height: "0vh" // 最初は長さゼロ・透明
    },
    visible: (custom: Ray) => ({
      opacity: custom.opacity, // 最終的にこの透明度で固定（消えない）
      height: `${custom.length}vh`, // 指定の長さ（ロゴ付近）まで伸びる
      transition: {
        // 15秒待ってから開始
        delay: 15.0 + custom.delay, 
        duration: custom.duration, // ゆっくり伸びて出現
        ease: "easeOut",
      }
    })
  };

  const spotlightVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 16.0, // 光が降りてくるタイミング(15s〜)に合わせて点灯
        duration: 3,
        ease: "easeInOut",
      },
    },
  };

  // 塵や霧のコンテナ用：30秒後にふわっと表示して、その後消さない
  const ambienceVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 30.0, duration: 4 }
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center text-white">
      
      {/* 背景：星空（これは最初から表示） */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.baseOpacity,
            }}
            animate={{
              opacity: [star.baseOpacity, star.baseOpacity * 0.3, star.baseOpacity],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/*  15秒後に現れる光の演出レイヤー（全体ラッパー） */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex justify-center"
        initial="hidden"
        animate="visible"
        variants={ambienceVariants} // コンテナごと15秒後にフェードイン
      >
        
        {/* 全体の霧（上半分） */}
        <div 
           className="absolute top-0 w-full h-[60vh] bg-gradient-to-b from-white via-transparent to-transparent"
           style={{ opacity: 0.3, filter: "blur(100px)", mixBlendMode: "overlay" }}
        />

        {/* 個別の光の柱 */}
        {rays.map((ray) => (
          <div
            key={ray.id}
            className="absolute top-0 origin-top" 
            style={{
              left: `calc(50% + ${(Math.random() * 120 - 60)}px)`, // 中央に集める
              transform: `rotate(${ray.angle}deg)`,
              width: `${ray.width}px`,
              height: "100%", 
            }}
          >
            {/* 層1: 周りの柔らかな発光 */}
            <motion.div
              custom={ray}
              initial="hidden"
              animate="visible"
              variants={rayVariants}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full bg-gradient-to-b from-white/40 via-white/10 to-transparent"
              style={{ filter: "blur(30px)" }}
            />
             {/* 層2: 芯となる鋭い光の筋 */}
            <motion.div
              custom={ray}
              initial="hidden"
              animate="visible"
              variants={rayVariants}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 bg-gradient-to-b from-white via-white/70 to-transparent"
              style={{ filter: "blur(6px)", mixBlendMode: "screen" }}
            />
          </div>
        ))}

        
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white rounded-full"
            style={{
              top: `${particle.y}%`,
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.6,
              filter: "blur(1px)",
            }}
            animate={{
              y: ["-5%", "5%"], 
              opacity: [0.3, 0.8, 0.3] // 点滅するが消えはしない
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>


      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={spotlightVariants}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)",
          filter: "blur(90px)",
          mixBlendMode: "screen"
        }}
      />

      {/* 中央の回転ロゴ  */}
      <div className="z-10 w-full max-w-2xl mb-8 relative">
        <DraggableLogo />
      </div>

      {/*  メニューリンク一覧 */}
      <div className="flex flex-col items-center space-y-8 z-10 -mt-20">
        <Link href="/store" className={linkStyle}>ITEM</Link>
        <Link href="/concept" className={linkStyle}>CONCEPT</Link>
        <a href="https://www.instagram.com/unsungstar_official?igsh=NDg0ZjVqbWs0ejY3" target="_blank" rel="noopener noreferrer" className={linkStyle + " text-2xl"}>INSTAGRAM</a>
        <a href="https://unsungstar.official.ec" target="_blank" rel="noopener noreferrer" className={linkStyle + " text-2xl"}>OFFICIAL SITE</a>
      </div>
    </main>
  );
}