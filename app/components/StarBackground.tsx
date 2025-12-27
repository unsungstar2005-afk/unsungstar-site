// components/StarBackground.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Star = {
  id: number;
  top: number;
  left: number;
  size: number;
  baseOpacity: number;
  duration: number;
};

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
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

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
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
  );
}