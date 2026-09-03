"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion, useSpring, useMotionValue, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type NumberTickerProps = {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  className?: string;
};

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  className,
}: NumberTickerProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : startValue);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }),
    [decimalPlaces],
  );

  useEffect(() => {
    if (reduce) {
      if (ref.current) {
        ref.current.textContent = formatter.format(value);
      }
      return;
    }
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isInView) {
      timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value);
      }, delay * 1000);
    }
    return () => {
      if (timer !== null) clearTimeout(timer);
    };
  }, [motionValue, isInView, delay, value, direction, startValue, formatter, reduce]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatter.format(Number(latest.toFixed(decimalPlaces)));
      }
    });
  }, [springValue, formatter, decimalPlaces]);

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)}>
      {startValue}
    </span>
  );
}