"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";

interface RotatingTextProps {
  texts: string[];
  mainClassName?: string;
  splitLevelClassName?: string;
  staggerFrom?: "first" | "last";
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
  staggerDuration?: number;
  transition?: Transition;
  rotationInterval?: number;
  splitBy?: "characters" | "words";
  loop?: boolean;
}

const RotatingText = ({
  texts,
  mainClassName = "",
  splitLevelClassName = "",
  staggerFrom = "first",
  initial = { y: "100%" },
  animate = { y: 0 },
  exit = { y: "-120%" },
  staggerDuration = 0.025,
  transition = { type: "spring", damping: 30, stiffness: 400 },
  rotationInterval = 2000,
  splitBy = "characters",
  loop = true,
}: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxLength = useMemo(
    () => Math.max(...texts.map((t) => t.length)),
    [texts],
  );

  const getNextIndex = useCallback(() => {
    if (loop) {
      return (currentIndex + 1) % texts.length;
    }
    if (currentIndex < texts.length - 1) {
      return currentIndex + 1;
    }
    return null;
  }, [currentIndex, texts.length, loop]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getNextIndex();
      if (next !== null) {
        setCurrentIndex(next);
      }
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [getNextIndex, rotationInterval]);

  const currentText = texts[currentIndex];
  const segments =
    splitBy === "characters" ? currentText.split("") : currentText.split(" ");

  return (
    <span
      className={`inline-block ${mainClassName}`}
      style={{ width: `${Math.ceil(maxLength / 2) + 2}ch` }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className="inline-flex flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {segments.map((char, i) => {
            const actualIndex =
              staggerFrom === "last" ? segments.length - 1 - i : i;
            return (
              <span
                key={`${currentIndex}-${actualIndex}`}
                className={`inline-block ${splitLevelClassName}`}
              >
                <motion.span
                  className="inline-block"
                  initial={initial}
                  animate={animate}
                  exit={exit}
                  transition={{
                    ...transition,
                    delay: actualIndex * staggerDuration,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
