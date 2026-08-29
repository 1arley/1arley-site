"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "FAQ", href: "/faq" },
  { label: "Admin", href: "/admin/content" },
];

/**
 * NAVBAR — the mixing desk strip.
 * Hides on scroll down, resurfaces on scroll up. Zero radius, grayscale,
 * REC indicator, mono type.
 */
const Navbar = () => {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

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

  useEffect(() => {
    if (!mobileOpen) return;
    const toggle = document.querySelector(
      '[aria-label="Abrir menu"]',
    ) as HTMLElement | null;
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
      if (e.shiftKey && (active === first || active === toggle)) {
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
      toggle?.focus();
    };
  }, [mobileOpen]);

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
          aria-label="Navegação principal"
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
        </nav>

        {/* Mobile toggle */}
        <button
          className="flex h-11 w-11 items-center justify-center border border-white/20 text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="border-t border-white/10 bg-black px-4 py-6 md:hidden mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Navegação móvel"
        >
          <nav className="flex flex-col" aria-label="Menu móvel">
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