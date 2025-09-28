import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create animated stars
    for (let i = 0; i < 50; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.animationDelay = Math.random() * 2 + "s";
      star.style.animationDuration = (2 + Math.random() * 3) + "s";
      container.appendChild(star);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated cosmic elements */}
      <motion.div
        className="absolute top-12 left-10 w-16 h-16 rounded-full opacity-60"
        style={{
          background: "linear-gradient(45deg, #8B5CF6, #EC4899)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute top-20 right-16 w-12 h-12 rounded-full opacity-40"
        style={{
          background: "linear-gradient(45deg, #3B82F6, #8B5CF6)",
        }}
        animate={{
          scale: [1, 0.8, 1],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-20 w-8 h-8 rounded-full opacity-50"
        style={{
          background: "linear-gradient(45deg, #EC4899, #F59E0B)",
        }}
        animate={{
          x: [0, 30, 0],
          rotate: [0, -360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
