"use client";

/**
 * TICKER DIVIDER — a section-to-section transition band.
 * Pure CSS marquee (zero WebGL) to keep the global WebGL context budget low.
 */
export default function TickerDivider({
  text = "FULL-STACK · SOUND · WEBGL · GRAIN · ROCK",
}: { text?: string }) {
  return (
    <section
      aria-hidden="true"
      className="relative z-20 overflow-hidden border-y border-white/10 bg-black-4 py-3.5"
    >
      <div className="ticker-mask overflow-hidden">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <span
              key={dup}
              className="flex shrink-0 items-center whitespace-nowrap px-5 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50"
            >
              {text.split("·").map((part, i) => (
                <span key={i} className="flex items-center">
                  <span>{part.trim()}</span>
                  <span className="px-10 text-white/40">///</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}