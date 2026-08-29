"use client";

/**
 * SECTION DIVIDER — brutal. A hard horizontal rule with a mono ticker,
 * used between the quiet and intense sections. Zero radius, grayscale.
 */
const SectionDivider = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative z-20 border-y border-white/10 bg-black-4 py-5 overflow-hidden ${className}`}>
      <div className="ticker-mask overflow-hidden" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <span
              key={dup}
              className="flex shrink-0 items-center gap-10 px-5 font-mono text-[11px] tracking-[0.3em] text-white/40 uppercase"
              aria-hidden="true"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="flex items-center gap-10">
                  <span>Preto &amp; Branco</span>
                  <span aria-hidden="true" className="text-white/20">///</span>
                  <span>Sem Compromisso</span>
                  <span aria-hidden="true" className="text-white/20">///</span>
                  <span>Brutal</span>
                  <span aria-hidden="true" className="text-white/20">///</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionDivider;
