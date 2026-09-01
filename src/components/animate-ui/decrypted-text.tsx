"use client";

import * as React from "react";
import { cn } from "@/utils/lib/utils";

type DecryptedTextProps = {
  text: string;
  /** Total time (ms) for the decode to settle. */
  revealTime?: number;
  className?: string;
  /** Element to render (default span, but often a heading tag). */
  as?: React.ElementType;
  onReveal?: () => void;
};

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]#$%&*+";

/**
 * DECRYPTED TEXT (from animate-ui, adapted for the terminal identity).
 * Characters decode into place — the rec-boot / console aesthetic — once the
 * element scrolls into view. Reduced-motion safe: renders the final text.
 */
export function DecryptedText({
  text,
  revealTime = 900,
  className,
  as: Tag = "span",
  onReveal,
}: DecryptedTextProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [display, setDisplay] = React.useState(text);
  const [started, setStarted] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = React.useCallback(
    (finalText: string) => {
      const len = finalText.length;
      const stepMs = Math.max(6, Math.floor(revealTime / len));
      let i = 0;
      const partial = (until: number) =>
        finalText
          .split("")
          .map((ch, idx) => (idx < until ? ch : ch === " " ? " " : rand()))
          .join("");
      setDisplay(partial(0));
      timer.current = setInterval(() => {
        i += 1;
        if (i >= len) {
          if (timer.current) clearInterval(timer.current);
          setDisplay(finalText);
          onReveal?.();
          return;
        }
        setDisplay(partial(i));
      }, stepMs);
    },
    [revealTime, onReveal],
  );

  React.useEffect(() => {
    // Reduced motion: show the final text immediately, keep it accessible.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
            scramble(text);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timer.current) clearInterval(timer.current);
    };
  }, [text, started, scramble]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      aria-hidden="true"
      className={cn("whitespace-pre", className)}
    >
      {display}
    </Tag>
  );
}

function rand() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

export default DecryptedText;
