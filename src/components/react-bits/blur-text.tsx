"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ElementType } from "react";
import { cn } from "@/lib/utils";

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  wordClassName?: string;
  as?: ElementType;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
};

export function BlurText({
  text = "",
  delay = 200,
  className,
  wordClassName,
  as: Comp = "span",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  stepDuration = 0.35,
}: BlurTextProps) {
  const reduce = useReducedMotion();
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (reduce) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin },
    );
    return () => observer.disconnect();
  }, [threshold, rootMargin, reduce]);

  const from =
    direction === "top"
      ? { filter: "blur(10px)", opacity: 0, y: -50 }
      : { filter: "blur(10px)", opacity: 0, y: 50 };

  const stepCount = 3;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = [0, 0.5, 1];
  const to = {
    filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
    opacity: [0, 0.5, 1],
    y: [from.y, direction === "top" ? 5 : -5, 0],
  };

  const Container = Comp as React.ElementType;

  return (
    <Container ref={ref} className={cn("inline-flex flex-wrap", className)}>
      {elements.map((segment, i) => {
        const isSpace = segment === " " || (animateBy === "words" && i < elements.length - 1);
        return (
          <motion.span
            key={`${segment}-${i}`}
            className={cn("inline-block will-change-[transform,filter,opacity]", wordClassName)}
            initial={reduce ? undefined : from}
            animate={!inView || reduce ? undefined : to}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: totalDuration,
                    times,
                    delay: (i * delay) / 1000,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            {segment === " " ? "\u00A0" : segment}
            {isSpace ? "\u00A0" : ""}
          </motion.span>
        );
      })}
    </Container>
  );
}