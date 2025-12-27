"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useSpring, useMotionValue, useTransform, animate } from "framer-motion";
import { useGesture } from "@use-gesture/react";

export default function DraggableLogo() {
  // 1. 自動回転用の値（常に動き続ける）
  const autoRotateY = useMotionValue(0);

  // 2. ドラッグ操作用のバネ（指の動き）
  const dragRotateX = useSpring(0, { stiffness: 50, damping: 20 });
  const dragRotateY = useSpring(0, { stiffness: 50, damping: 20 });

  // コンポーネントが表示されたら、自動回転をスタート
  useEffect(() => {
    // 30秒かけて0度から-360度まで回る（無限ループ）
    const controls = animate(autoRotateY, -360, {
      ease: "linear",
      duration: 30, // この数字を小さくすると速く、大きくすると遅くなります
      repeat: Infinity,
    });
    return controls.stop;
  }, [autoRotateY]);

  // 3. 「自動」と「ドラッグ」の値を合体させる
  // rotateY（横回転）は、自動回転(auto) + ドラッグ(drag) の合計値にする
  const combinedRotateY = useTransform(
    [autoRotateY, dragRotateY],
    ([auto, drag]) => auto + drag
  );

  const bind = useGesture({
    onDrag: ({ offset: [dx, dy] }) => {
      dragRotateY.set(dx);
      // 縦方向はドラッグした時だけ動く（奥に倒れる動き）
      dragRotateX.set(-dy); 
    },
  });

  return (
    <div 
      className="w-full flex items-center justify-center relative overflow-visible z-10 my-12"
      style={{ perspective: "1000px", height: "600px" }} // コンテナの高さも確保
    >
      <motion.div
        {...bind()}
        style={{ 
          rotateX: dragRotateX, 
          rotateY: combinedRotateY, 
          touchAction: "none",
          transformStyle: "preserve-3d"
        }}
        className="cursor-grab active:cursor-grabbing origin-center"
      >
        <Image
          src="/logo.png"
          alt="UNSUNG STAR Logo"
          width={900}
          height={600}
          className="pointer-events-none select-none object-contain max-w-[90vw]" // 画面からはみ出さないよう調整
          draggable={false}
          priority
        />
      </motion.div>
    </div>
  );
}