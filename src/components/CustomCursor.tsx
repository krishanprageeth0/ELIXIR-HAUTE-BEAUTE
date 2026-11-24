"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer devices (desktop)
    if (window.matchMedia("(pointer: fine)").matches) {
      setVisible(true);

      const handleMove = (e: MouseEvent) => {
        setPos({ x: e.clientX, y: e.clientY });
      };

      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest("a, button, input, select, textarea, [data-interactive]")) {
          setHovered(true);
        } else {
          setHovered(false);
        }
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseover", handleMouseOver);

      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseover", handleMouseOver);
      };
    }
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Subtle gold center dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#C8A46A] pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
          scale: hovered ? 2 : 1,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.1 }}
      />
      {/* Outer elegant halo */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#C8A46A]/40 pointer-events-none z-50"
        animate={{
          x: pos.x - 18,
          y: pos.y - 18,
          width: hovered ? 46 : 36,
          height: hovered ? 46 : 36,
          backgroundColor: hovered ? "rgba(200, 164, 106, 0.08)" : "rgba(200, 164, 106, 0)",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.2 }}
      />
    </>
  );
}
