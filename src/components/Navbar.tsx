"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/lib/i18n";

/**
 * NAVBAR — the mixing desk strip.
 * Hides on scroll down, resurfaces on scroll up. Zero radius, grayscale,
 * REC indicator, mono type. Includes PT/EN language switch.
 */
const Navbar = () => {
  const { t, locale, setLocale } = useLocale();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

  const navItems = [
    { label: t.navbar.home, href: "/" },
    { label: t.navbar.about, href: "/sobre" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > lastY.current && y > 120) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Scroll-lock while the mobile menu is open so the page doesn't scroll
  // behind the dialog.
  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const focusTrap = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const links = Array.from(
        document.querySelectorAll<HTMLElement>(".mobile-nav a"),
      );
      if (!links.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === toggleRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", focusTrap);
    requestAnimationFrame(() => {
      (document.querySelector(".mobile-nav a") as HTMLElement)?.focus();
    });
    return () => {
      document.removeEventListener("keydown", focusTrap);
      toggleRef.current?.focus();
    };
  }, [mobileOpen]);

  const LangSwitch = (
    <div
      className="flex items-center border border-white/20 font-mono text-[10px] tracking-[0.15em]"
      role="group"
      aria-label="Idioma / Language"
    >
      <button
        onClick={() => setLocale("pt")}
        aria-pressed={locale === "pt"}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-[11px] transition-colors ${
          locale === "pt"
            ? "bg-white text-black"
            : "text-white/70 hover:text-white"
        }`}
      >
        PT
      </button>
      <button
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-[11px] transition-colors ${
          locale === "en"
            ? "bg-white text-black"
            : "text-white/70 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 border-b transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "border-white/20 bg-black/95"
          : "border-white/10 bg-black/80 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center bg-white font-mono text-sm font-bold text-black">
            &gt;_
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[16px] font-black uppercase tracking-wide text-white">
              1arley
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/50">
              rock·full-stack
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={t.navbar.ariaNav}
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "text-gray-80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {LangSwitch}
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {LangSwitch}
          <button
            ref={toggleRef}
            className="flex h-11 w-11 items-center justify-center border border-white/20 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.navbar.ariaClose : t.navbar.ariaOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="border-t border-white/10 bg-black px-4 py-6 md:hidden mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={t.navbar.ariaMobile}
        >
          <nav className="flex flex-col" aria-label={t.navbar.ariaMobile}>
            {navItems.map((item, i) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ transitionDelay: `${i * 40}ms` }}
                  className={`flex items-center justify-between border-b border-white/10 py-4 text-base font-semibold uppercase tracking-wide transition-colors ${
                    active ? "text-white" : "text-gray-80 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span className="font-mono text-xs text-white/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
