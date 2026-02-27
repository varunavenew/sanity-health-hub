import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplitCurtainRevealProps {
  onComplete: () => void;
}

export const SplitCurtainReveal = ({ onComplete }: SplitCurtainRevealProps) => {
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    // Start reveal animation after displaying the message
    const timer = setTimeout(() => {
      setIsRevealing(true);
    }, 3500);

    // Call onComplete after the curtain fully opens
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsRevealing(true);
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {!isRevealing ? (
        <>
          {/* Left Curtain Panel */}
          <motion.div
            className="fixed inset-y-0 left-0 w-1/2 bg-brand-dark z-[100] flex items-center justify-end"
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="pr-6 md:pr-10 text-right">
              <motion.p
                className="text-white text-xl md:text-3xl lg:text-4xl font-light tracking-wide leading-relaxed"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Nordens
              </motion.p>
              <motion.p
                className="text-white text-xl md:text-3xl lg:text-4xl font-light tracking-wide leading-relaxed"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                ledende
              </motion.p>
              <motion.p
                className="text-white text-xl md:text-3xl lg:text-4xl font-light tracking-wide leading-relaxed"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              >
                klinikk for
              </motion.p>
            </div>
          </motion.div>

          {/* Right Curtain Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 w-1/2 bg-accent z-[100] flex items-center justify-start"
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="pl-6 md:pl-10 text-left">
              <motion.p
                className="text-brand-dark text-xl md:text-3xl lg:text-4xl font-light tracking-wide leading-relaxed"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
              >
                livet
              </motion.p>
              <motion.p
                className="text-brand-dark text-xl md:text-3xl lg:text-4xl font-light tracking-wide leading-relaxed"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
              >
                og
              </motion.p>
              <motion.p
                className="text-brand-dark text-xl md:text-3xl lg:text-4xl font-light tracking-wide leading-relaxed"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.9, duration: 0.8 }}
              >
                underlivet
              </motion.p>
            </div>
          </motion.div>

          {/* Center divider line */}
          <motion.div
            className="fixed top-0 bottom-0 left-1/2 w-px bg-white/30 z-[101]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Skip button */}
          <motion.button
            onClick={handleSkip}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[102] px-6 py-2 text-sm text-white/70 hover:text-white border border-white/30 hover:border-white/60 rounded-full backdrop-blur-sm transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            Hopp over
          </motion.button>
        </>
      ) : null}
    </AnimatePresence>
  );
};
