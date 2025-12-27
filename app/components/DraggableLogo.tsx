"use client";

import { useRef, useEffect } from "react";
import { 
  motion, 
  useAnimation, 
  useMotionValue, 
  useTransform, 
  useSpring,
  PanInfo 
} from "framer-motion";

export default function DraggableLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const autoRotateY = useMotionValue(0);
  const dragRotateY = useMotionValue(0);
  
  const smoothDragRotateY = useSpring(dragRotateY, {
    stiffness: 150,
    damping: 20
  });

  // 型定義 (: any) を追加済み
  const combinedRotateY = useTransform(
    [autoRotateY, smoothDragRotateY],
    ([auto, drag]: any) => auto + drag
  );

  useEffect(() => {
    controls.start({
      rotateY: 360,
      transition: {
        duration: 20, 
        ease: "linear",
        repeat: Infinity,
      }
    });
    
    const animateAuto = () => {
      const duration = 20000; 
      const start = performance.now();
      
      const step = (time: number) => {
        const elapsed = time - start;
        const angle = (elapsed / duration) * 360; 
        autoRotateY.set(angle);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    
    animateAuto();
    
  }, [autoRotateY, controls]);

  const handleDrag = (event: any, info: PanInfo) => {
    const currentDrag = dragRotateY.get();
    dragRotateY.set(currentDrag + info.delta.x * 0.5);
  };

  const handleDragEnd = () => {
    // 処理なし
  };

  return (
    <div 
      ref={containerRef} 
      className="perspective-1000 cursor-grab active:cursor-grabbing"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        drag="x"
        dragConstraints={containerRef} 
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ 
          rotateY: combinedRotateY, 
          transformStyle: "preserve-3d" 
        }}
        dragElastic={0}
        dragMomentum={false}
      >
        {/* ▼▼▼ 修正箇所：パスを /logo.png に変更 ▼▼▼ */}
        <img 
          src="/logo.png" 
          alt="UNSUNG STAR Logo" 
          className="w-full h-auto max-w-xs md:max-w-md pointer-events-none select-none block mx-auto"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}