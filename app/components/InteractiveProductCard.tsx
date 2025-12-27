"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useSpring, useMotionValue, useTransform, animate } from "framer-motion";
import { useGesture } from "@use-gesture/react";

type Props = {
  src: string;
  alt: string;
  itemId: number;
  shopDomain: string;
};

export default function InteractiveProductCard({ src, alt, itemId, shopDomain }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const autoRotateY = useMotionValue(0);
  const dragRotateX = useSpring(0, { stiffness: 50, damping: 20 });
  const dragRotateY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    // ▼ ここを変更: duration を 60 にして、もっとゆっくりにする
    const controls = animate(autoRotateY, -360, {
      ease: "linear",
      duration: 60, // 60秒かけて一周（数字を大きくするとさらに遅くなります）
      repeat: Infinity,
    });
    return controls.stop;
  }, [autoRotateY]);

  const combinedRotateY = useTransform(
    [autoRotateY, dragRotateY],
    ([auto, drag]) => auto + drag
  );

  const bind = useGesture({
    onDragStart: () => setIsDragging(true),
    onDrag: ({ offset: [dx, dy] }) => {
      dragRotateY.set(dx);
      dragRotateX.set(-dy);
    },
    onDragEnd: () => {
      setTimeout(() => setIsDragging(false), 100);
    },
    onClick: () => {
      if (!isDragging) {
        const url = `https://${shopDomain}/items/${itemId}`;
        window.location.href = url;
      }
    }
  });

  return (
    <div className="relative w-full aspect-[3/4] overflow-visible perspective-container z-10 mb-4">
      <motion.div
        {...bind()}
        style={{
          rotateX: dragRotateX,
          rotateY: combinedRotateY,
          touchAction: "none",
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing origin-center rounded-lg preserve-3d shadow-2xl shadow-black/50"
      >
        <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden preserve-3d">
            <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover pointer-events-none select-none"
            draggable={false}
            />
        </div>
      </motion.div>
    </div>
  );
}