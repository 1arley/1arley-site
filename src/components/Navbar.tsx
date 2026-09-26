"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export default function Navbar() {
  const { t, locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  const navItems = [
    { label: t.navbar.home, href: "/" },
    { label: t.navbar.about, href: "/sobre" },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();

    if (!mobileOpen) {
      return () => {
        document.documentElement.style.overflow = "";
      };
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const languageSwitch = (
    <div
      className="flex h-11 items-stretch border-l border-white/15 font-mono text-[10px]"
      role="group"
      aria-label="Idioma / Language"
    >
      {(["pt", "en"] as const).map((option) => (
        <button
          key={option}
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          className={`min-w-11 px-3 uppercase transition-colors ${
            locale === option
              ? "bg-white text-black"
              : "text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/15 bg-black/95">
      <div className="mx-auto flex h-16 max-w-[1600px] items-stretch justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-h-11 items-center gap-3 pr-4"
          aria-label="1arley, início"
        >
          <span className="grid h-8 w-8 place-items-center bg-white font-mono text-xs font-bold text-black transition-colors group-hover:bg-gray-80">
            &gt;_
          </span>
          <span className="font-display text-lg uppercase leading-none text-white">
            1arley
          </span>
          <span className="hidden border-l border-white/20 pl-3 font-mono text-[9px] uppercase leading-tight text-white/50 sm:block">
            rock / full-stack
          </span>
        </Link>

        <div className="flex items-stretch">
          <nav
            className="hidden items-stretch border-l border-white/15 md:flex"
            aria-label={t.navbar.ariaNav}
          >
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-w-24 items-center justify-center border-r border-white/15 px-5 text-xs font-semibold uppercase transition-colors ${
                    active
                      ? "bg-white text-black"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {languageSwitch}

          <button
            ref={toggleRef}
            className="grid h-11 w-11 place-items-center border-x border-white/15 text-white md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.navbar.ariaClose : t.navbar.ariaOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

        <dialog
          ref={dialogRef}
          onClose={() => { setMobileOpen(false); toggleRef.current?.focus(); }}
          className="mobile-nav fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none border-0 bg-black px-4 py-8 text-white"
          role="dialog"
          aria-label={t.navbar.ariaMobile}
        >
          <button onClick={() => setMobileOpen(false)} aria-label={t.navbar.ariaClose} className="mb-6 ml-auto grid h-11 w-11 place-items-center border border-white/30">
            <X size={18} />
          </button>
          <nav aria-label={t.navbar.ariaMobile}>
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-16 items-center border-b border-white/15 font-headline text-4xl uppercase ${
                    active ? "text-white" : "text-white/55 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </dialog>
    </header>
  );
}
