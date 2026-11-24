"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show preloader on first session visit
    const hasSeen = sessionStorage.getItem("elixir_intro_seen");
    if (!hasSeen) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("elixir_intro_seen", "true");
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111111]"
        >
          {/* Subtle gold glow behind logo */}
          <div className="absolute w-72 h-72 rounded-full bg-[#C8A46A]/10 blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center text-center relative z-10"
          >
            {/* Monogram emblem */}
            <div className="w-16 h-16 mb-6 rounded-full border border-[#C8A46A]/40 flex items-center justify-center relative">
              <div className="absolute inset-1 rounded-full border border-[#C8A46A]/20" />
              <span className="font-serif text-2xl text-[#C8A46A] tracking-wider">É</span>
            </div>

            <motion.h1
              initial={{ letterSpacing: "0.2em", opacity: 0 }}
              animate={{ letterSpacing: "0.35em", opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="font-serif text-2xl md:text-3xl text-[#F8F6F2] font-normal tracking-[0.35em] uppercase mb-2"
            >
              Élixir
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-[10px] md:text-xs text-[#C8A46A] tracking-[0.4em] uppercase"
            >
              Haute Beauté · 2027
            </motion.p>

            {/* Minimalist progress line */}
            <div className="w-36 h-[1px] bg-white/10 mt-8 overflow-hidden relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-[#C8A46A] to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
