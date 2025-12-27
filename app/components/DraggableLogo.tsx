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

  // 自動回転用の値 (0 -> 360 -> ...)
  const autoRotateY = useMotionValue(0);

  // ドラッグによる追加回転 (ユーザー操作)
  const dragRotateY = useMotionValue(0);
  
  // バネの動き（ドラッグ終了時に少し戻るなどの挙動用）
  const smoothDragRotateY = useSpring(dragRotateY, {
    stiffness: 150,
    damping: 20
  });

  // ▼▼▼ 【修正箇所】ここで型定義 (: any) を追加しました ▼▼▼
  const combinedRotateY = useTransform(
    [autoRotateY, smoothDragRotateY],
    ([auto, drag]: any) => auto + drag
  );

  useEffect(() => {
    // コンポーネントマウント時に自動回転アニメーションを開始
    // ループ再生
    controls.start({
      rotateY: 360,
      transition: {
        duration: 20, // 20秒で1周
        ease: "linear",
        repeat: Infinity,
      }
    });
    
    // motion valueをアニメーションさせるためのハック
    // animate関数ではなく、controls経由で値を更新させるには
    // 実際には autoRotateY を直接 animate() で回す方が簡単ですが
    // Framer Motionの仕様に合わせて今回は簡易的なタイマーまたはanimate関数を使います
    
    const animateAuto = () => {
      // requestAnimationFrame等で回し続ける実装も可能ですが
      // ここではシンプルに framer-motion の animate を使って値を更新します
      const duration = 20000; // 20秒
      const start = performance.now();
      
      const step = (time: number) => {
        const elapsed = time - start;
        // 無限に増え続ける角度
        const angle = (elapsed / duration) * 360; 
        autoRotateY.set(angle);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    
    animateAuto();
    
  }, [autoRotateY, controls]);

  const handleDrag = (event: any, info: PanInfo) => {
    // ドラッグ量（ピクセル）を角度に変換して加算
    // 例: 1px移動 = 0.5度回転
    const currentDrag = dragRotateY.get();
    dragRotateY.set(currentDrag + info.delta.x * 0.5);
  };

  const handleDragEnd = () => {
    // ドラッグが終わったら、慣性で少し回るなどの処理も書けますが
    // ここでは特にリセットせず、その角度を維持（あるいはバネで戻すならset(0)など）
    // 今回は「回した分だけずれる」仕様のままにします
  };

  return (
    <div 
      ref={containerRef} 
      className="perspective-1000 cursor-grab active:cursor-grabbing"
      style={{ perspective: "1000px" }} // CSSでも念のため指定
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
        // ドラッグしても位置自体（x,y）は動かさない（回転だけさせるため）
        dragElastic={0}
        dragMomentum={false}
      >
        {/* ロゴ画像 */}
        {/* Next.jsのImageコンポーネントを使う場合、pointerEventsをnoneにしないとドラッグしにくい場合があります */}
        <img 
          src="/images/logo.png" 
          alt="UNSUNG STAR Logo" 
          className="w-full h-auto max-w-xs md:max-w-md pointer-events-none select-none block mx-auto"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}