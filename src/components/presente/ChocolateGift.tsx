"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./ChocolateGift.module.css";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type Phase = "idle" | "opening" | "opened" | "revealed";

const CONFETTI_COLORS = ["#F5C542", "#FFE9A3", "#E0A31E", "#FFF7E8", "#7B4CC7"];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  life: number;
};

function burstConfetti(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const originX = width / 2;
  const originY = height * 0.44;
  const particles: Particle[] = [];
  for (let i = 0; i < 150; i += 1) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
    const speed = 6 + Math.random() * 11;
    particles.push({
      x: originX + (Math.random() - 0.5) * 60,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      w: 6 + Math.random() * 7,
      h: 9 + Math.random() * 11,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      life: 1,
    });
  }

  let raf = 0;
  const tick = () => {
    ctx.clearRect(0, 0, width, height);
    let alive = 0;
    for (const p of particles) {
      p.vy += 0.24;
      p.vx *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.006;
      if (p.life <= 0 || p.y > height + 40) continue;
      alive += 1;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive === 0) {
      ctx.clearRect(0, 0, width, height);
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, width, height);
  };
}

function FoilSide() {
  return (
    <g
      style={{
        transformBox: "fill-box",
        transformOrigin: "center",
      }}
    >
      <path
        d="M42,50 H176 l-10,24 l12,24 l-12,24 l12,24 l-12,24 l12,24 l-12,24 l12,24 l-12,24 l12,16 V290 H42 Q34,290 34,282 V58 Q34,50 42,50 Z"
        fill="url(#foil)"
      />
      <g fill="#5B32A8" stroke="#F5C542" strokeWidth="2" strokeLinejoin="round">
        <path d="M36,167 L6,133 L6,167 Z" />
        <path d="M36,173 L6,207 L6,173 Z" />
        <circle cx="31" cy="170" r="9" fill="#6B3FC4" />
      </g>
      <path d="M74,50 h8 l-14,240 h-8 Z" fill="#F5C542" opacity="0.3" />
      <path d="M110,50 h5 l-10,240 h-5 Z" fill="#FFE9A3" opacity="0.2" />
      <path
        d="M176,50 l-10,24 l12,24 l-12,24 l12,24 l-12,24 l12,24 l-12,24 l12,24 l-12,24 l12,16"
        fill="none"
        stroke="#F5C542"
        strokeWidth="2"
        strokeDasharray="6 7"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d="M42,50 H176 l-4,10 H42 Q34,60 34,68 V58 Q34,50 42,50 Z" fill="#FFF7E8" opacity="0.35" />
    </g>
  );
}

function ChocolateBar({ prefix = "" }: { prefix?: string }) {
  const cells: Array<{ x: number; y: number }> = [];
  for (const x of [78, 164]) {
    for (const y of [62, 142, 222]) cells.push({ x, y });
  }
  const id = (name: string) => `${prefix}${name}`;
  return (
    <g>
      <rect x="66" y="46" width="188" height="248" rx="16" fill={`url(#${id("choc")})`} />
      {cells.map((c) => (
        <g key={`${c.x}-${c.y}`}>
          <rect x={c.x} y={c.y} width="78" height="66" rx="10" fill="#6B4126" />
          <rect x={c.x} y={c.y} width="78" height="66" rx="10" fill={`url(#${id("chocTop")})`} />
          <rect
            x={c.x + 6}
            y={c.y + 6}
            width="66"
            height="26"
            rx="6"
            fill="#FFF7E8"
            opacity="0.07"
          />
        </g>
      ))}
      <rect x="66" y="46" width="188" height="248" rx="16" fill={`url(#${id("sheen")})`} />
    </g>
  );
}

const NOTES = [
  ["♡", "Um docinho pro sortudo de hoje."],
  ["✦", "Hoje pode ser um daqueles dias. Vai com calma."],
  ["☾", "Tava precisando de um docinho. Tomara que acalme o dia."],
  ["∞", "Chocolate bom é assim: sempre dá pra repetir."],
  ["☀", "Uma pausa, um docinho e um pouquinho de carinho."],
  ["✿", "Esse pedacinho é só pra te ver sorrir."],
];
const REWARDS = [
  "1 chocolate de verdade, embrulhado",
  "1 fatia de chocolate quente com marshmallow",
  "1 pedaço de bolo de chocolate",
];
const SAVED_TICKET = `Bilhete dourado Nº 001 — Para Letícia\n\n${REWARDS.join("\n")}\n\nSem data de validade. Aceito em qualquer dia ruim.\n\nHoje o mundo pode pesar. Pega um docinho e desacelera.\n— Iarley`;

export function ChocolateGift({ className }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [shakes, setShakes] = useState(0);
  const [pieces, setPieces] = useState<number[]>([]);
  const [note, setNote] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [reward, setReward] = useState<number | null>(null);
  const reduce = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const previousPhase = useRef<Phase>("idle");
  const opening = phase !== "idle";
  const step = phase === "revealed" ? 2 : phase === "opened" ? 1 : 0;

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  useEffect(() => {
    if (previousPhase.current !== phase && phase !== "opening") actionRef.current?.focus({ preventScroll: true });
    previousPhase.current = phase;
    if (phase !== "revealed" || reduce || !canvasRef.current) return;
    return burstConfetti(canvasRef.current);
  }, [phase, reduce]);

  function handleOpen() {
    if (phase !== "idle") return;
    if (reduce) { setPhase("opened"); return; }
    setPhase("opening");
    timerRef.current = setTimeout(() => setPhase("opened"), 900);
  }

  function handleReplay() {
    if (timerRef.current) clearTimeout(timerRef.current);
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setPhase("idle"); setPieces([]); setNote(null); setFlipped(false); setReward(null); setShakes(0);
  }

  return (
    <main className={`${styles.page} ${className ?? ""}`}>
      <canvas ref={canvasRef} aria-hidden="true" className={styles.confetti} />
      <header className={styles.header}>
        <span className={styles.brand}><span aria-hidden="true">✳</span> Fábrica de pequenos carinhos</span>
        <span className={styles.edition}>Edição única, feita pra você</span>
      </header>

      <div className={styles.layout}>
        <section className={styles.intro}>
          <p className={styles.greeting}>Oooh! Sorte grande.</p>
          <h1>{phase === "revealed" ? <>A sorte tem<br />o seu nome.</> : <>Um doce<br />só seu.</>}</h1>          <p className={styles.description}>
            {phase === "revealed"
              ? "Um bilhete dourado, três prêmios e uma fábrica toda sua. Sorte de quem chegou até aqui."
              : "Uma caixinha, um laço e um docinho esperando. Será que veio premiado?"}
          </p>
          <ol className={styles.steps} aria-label="Etapas do presente">
            {["Desembrulhe", "Experimente", "Descubra"].map((label, index) => (
              <li key={label} aria-current={step === index ? "step" : undefined} data-complete={step > index}>
                <span>{step > index ? "✓" : `0${index + 1}`}</span>{label}
              </li>
            ))}
          </ol>
          <p className={styles.signature}>da loja de pequenos carinhos <span aria-hidden="true">♡</span></p>
        </section>

        <section className={styles.experience} aria-label="Seu chocolate surpresa" aria-busy={phase === "opening"}>
          <div className={styles.orbit} aria-hidden="true" />
          <span className={styles.starOne} aria-hidden="true">✧</span>
          <span className={styles.starTwo} aria-hidden="true">✦</span>
            {(phase === "idle" || phase === "opening") && (
              <motion.div key="wrapped" className={styles.scene}>
                <p className={styles.handNote}>psiu… tem uma surpresa aí dentro</p>
                <motion.div key={shakes} className={styles.package}
                  initial={false}
                  animate={reduce ? {} : { rotate: shakes ? [0, -9, 8, -6, 4, 0] : [-5, 0], y: [0, -5, 0] }}
                  transition={{ duration: 0.6 }}>
            <svg
              viewBox="0 0 320 340"
              className={styles.wrappedSvg}
              role="img"
              aria-label="Chocolate embrulhado em papel roxo e dourado"
            >
              <defs>
                <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6B3FC4" />
                  <stop offset="45%" stopColor="#4C2A8E" />
                  <stop offset="100%" stopColor="#33196A" />
                </linearGradient>
                <linearGradient id="choc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5A3620" />
                  <stop offset="100%" stopColor="#3B2314" />
                </linearGradient>
                <linearGradient id="chocTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5A36" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6B4126" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFF7E8" stopOpacity="0.18" />
                  <stop offset="40%" stopColor="#FFF7E8" stopOpacity="0" />
                </linearGradient>
              </defs>

              <ChocolateBar />

              <motion.g
                animate={
                  opening
                    ? { x: -150, y: 70, rotate: -42 }
                    : { x: 0, y: 0, rotate: 0 }
                }
                transition={{ duration: reduce ? 0 : 0.85, ease: [0.2, 0.8, 0.3, 1] }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <FoilSide />
              </motion.g>
              <motion.g
                animate={
                  opening
                    ? { x: 150, y: 70, rotate: 42 }
                    : { x: 0, y: 0, rotate: 0 }
                }
                transition={{ duration: reduce ? 0 : 0.85, ease: [0.2, 0.8, 0.3, 1] }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <g transform="translate(320,0) scale(-1,1)">
                  <FoilSide />
                </g>
              </motion.g>

              <g>
                <path
                  d="M160,42 C148,18 120,20 114,38 C108,54 136,62 160,50 Z"
                  fill="#F5C542"
                  stroke="#B47D10"
                  strokeWidth="1.5"
                />
                <path
                  d="M160,42 C172,18 200,20 206,38 C212,54 184,62 160,50 Z"
                  fill="#F5C542"
                  stroke="#B47D10"
                  strokeWidth="1.5"
                />
                <path
                  d="M160,46 C164,42 172,44 172,50 C172,57 164,59 160,55 C156,59 148,57 148,50 C148,44 156,42 160,46 Z"
                  fill="#E0A31E"
                />
                <path d="M154,54 L142,94 L146,98 L154,72 L158,98 L162,72 L166,98 L170,94 L158,54 Z" fill="#E0A31E" stroke="#B47D10" strokeWidth="1.2" />
              </g>
            </svg>
                  {!opening && <div className={styles.wrapperLabel} aria-hidden="true"><span>feito de carinho</span><strong>Doce<br />surpresa</strong><small>para o premiado ♡</small></div>}
                </motion.div>
                <p className={styles.hint} aria-live="polite">{opening ? "Desfazendo o laço…" : shakes ? ["Ouviu? Acho que tem mais que chocolate aí…", "Calma, curiosa. O carinho é frágil!", "Tá bom, tá bom. Pode abrir ♡"][(shakes - 1) % 3] : "Zero calorias. Uma dose extra de carinho."}</p>
                <button ref={actionRef} type="button" className={styles.primary} onClick={handleOpen} disabled={opening}>{opening ? "Abrindo…" : "Desembrulhar meu chocolate"}<span aria-hidden="true">↗</span></button>
                <button type="button" className={styles.textButton} disabled={opening} onClick={() => setShakes(value => value + 1)}>Dar uma chacoalhadinha <span aria-hidden="true">↝</span></button>
              </motion.div>
            )}

            {phase === "opened" && (
              <motion.div key="chocolate" className={styles.scene} initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <h2 className={styles.handNote}>Carinho em cada pedacinho.</h2>
                <p className={styles.small}>Toque no chocolate. Tem recadinhos escondidos.</p>
                <div className={styles.chocolate} aria-label="Seis pedacinhos de chocolate">
                  {NOTES.map(([symbol, message], index) => (
                    <button ref={index === 0 ? actionRef : undefined} key={symbol} type="button" aria-label={`Pedacinho ${index + 1}${pieces.includes(index) ? ", ler recado novamente" : ", descobrir recado"}`} aria-pressed={pieces.includes(index)} className={styles.piece}
                      onClick={() => { setNote(index); setPieces(current => current.includes(index) ? current : [...current, index]); }}>
                      <span className={styles.pieceSecret} aria-hidden="true">{symbol}</span>
                      <span className={styles.pieceTop} aria-hidden="true">♡</span>
                      <span className="sr-only">{pieces.includes(index) ? message : ""}</span>
                    </button>
                  ))}
                </div>
                <div className={styles.noteArea} aria-live="polite" aria-atomic="true">
                  <p className={styles.pieceNote}>{note === null ? "Pode escolher. O primeiro pedaço é seu ♡" : NOTES[note][1]}</p>
                  <span className={styles.small}>{pieces.length} de 6 recadinhos descobertos</span>
                </div>
                <button type="button" className={styles.primary} onClick={() => setPhase("revealed")}>Revelar meu bilhete dourado <span aria-hidden="true">✦</span></button>
                <p className={styles.small}>Pode provar todos ou ir direto pra surpresa.</p>
              </motion.div>
            )}

            {phase === "revealed" && (
              <motion.div key="ticket" className={styles.scene} initial={reduce ? false : { opacity: 0, y: 35, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ type: "spring", stiffness: 130, damping: 18 }}>
                <p className={styles.handNote}>Eu sabia que vinha premiado.</p>
                <div className={styles.ticketSpace}>
                  <div className={styles.ticketFlip} data-flipped={flipped}>
                    <div className={`${styles.ticket} ${styles.ticketFront}`} inert={flipped} aria-hidden={flipped}>
                      <div className={styles.ticketTop}><span>Fábrica da Sorte</span><span>Nº 001</span></div>
                      <span className={styles.ticketStar} aria-hidden="true">✳</span>
                      <h2>Bilhete<br />dourado</h2>
                      <p className={styles.ticketOwner}>Parabéns! Você tirou<br />o bilhete premiado.</p>
                      <div className={styles.rewards}>
                        <p>Quem venceu o prêmio?</p>
                        {REWARDS.map((label, index) => <button key={label} type="button" aria-pressed={reward === index} onClick={() => setReward(index)}><span aria-hidden="true">{reward === index ? "♥" : "♡"}</span>{label}<span aria-hidden="true">{reward === index ? "✓" : "+"}</span></button>)}
                      </div>
                      <p className={styles.ticketFine}>Sem data de validade.<br />Aceito em qualquer dia ruim.</p>
                    </div>
                    <div className={`${styles.ticket} ${styles.ticketBack}`} inert={!flipped} aria-hidden={!flipped}>
                      <span className={styles.ticketTop}>Um recadinho do outro lado</span>
                      <span className={styles.letterHeart} aria-hidden="true">♡</span>
                      <h2>Pra você, Letícia.</h2>
                      <p>hoje o mundo pode pesar. pega um docinho e desacelera.</p>
                      <span className={styles.letterSignature}>— Iarley</span>
                      <span className={styles.ticketFine}>O chocolate é virtual. O carinho é de verdade.</span>
                    </div>
                  </div>
                </div>
                <p className={styles.rewardNote} aria-live="polite">{reward === null ? "Os três são seus. Escolhe qual vem primeiro ♡" : ["Chocolate primeiro. Dessa vez, de verdade ♡", "Chocolate quente primeiro. Com marshmallow por cima ♡", "Bolo primeiro. O doce compensa o dia ♡"][reward]}</p>
                <button ref={actionRef} type="button" className={styles.primary} onClick={() => setFlipped(value => !value)} aria-pressed={flipped}>{flipped ? "Voltar ao bilhete" : "Ler o verso do bilhete"}<span aria-hidden="true">↻</span></button>
                <div className={styles.ticketActions}>
                  <a className={styles.textButton} href={`data:text/plain;charset=utf-8,${encodeURIComponent(SAVED_TICKET)}`} download="bilhete-dourado.txt">Guardar meu bilhete ↓</a>
                  <button className={styles.textButton} type="button" onClick={handleReplay}>Abrir de novo</button>
                </div>
              </motion.div>
            )}
        </section>
      </div>
      <footer className={styles.footer}><span>Feito pra adoçar um dia seu.</span><span>Chocolate virtual. Carinho de verdade. <span aria-hidden="true">♡</span></span></footer>
    </main>
  );
}
