"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "FAQ", href: "/faq" },
  { label: "Admin", href: "/admin/content" },
];

const Navbar = ({ light = false }: { light?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [isFirstLoad, setIsFirstLoad] = useState(() => {
    if (typeof window === 'undefined') return true;
    // @ts-ignore
    return !window.navbarHasAnimated;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && isFirstLoad) {
      // @ts-ignore
      window.navbarHasAnimated = true;
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const glassStyle = light
    ? {
        background: "rgba(255, 255, 255, 0.7)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(40px) saturate(200%) brightness(1.2) contrast(1.1)",
        WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.2) contrast(1.1)",
      }
    : {
        background: "rgba(100, 100, 100, 0.15)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 2px rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(40px) saturate(200%) brightness(1.2) contrast(1.1)",
        WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.2) contrast(1.1)",
      };

  const dropdownStyle = light
    ? {
      background: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)"
      }
    : {
        background: "rgba(19, 24, 30, 0.98)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      };

  return (
    <motion.header
      initial={isFirstLoad ? { y: -100, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-[40px] w-full z-50 pointer-events-none"
    >
      <div className="container mx-auto px-6 relative flex justify-center">
        <div className="absolute left-6 top-1 pointer-events-auto block md:hidden lg:block">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className={`w-10 h-10 rounded-[12px] ${light ? "bg-primary/10 border-primary/20" : "bg-[#111113]/30 border-white/10"} backdrop-blur-xl border flex items-center justify-center transition-all group-hover:bg-primary/20 shadow-lg`}>
              <span className={`font-mono ${light ? "text-primary" : "text-cyan"} font-bold text-[14px]`}>
                &gt;_
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className={`font-display font-bold text-[15px] ${light ? "text-slate-900" : "text-white"} leading-none tracking-wide`}>
                1arley
              </span>
              <span className={`font-mono text-[10px] ${light ? "text-slate-500" : "text-zinc-400"} leading-none mt-1 uppercase tracking-wider`}>
                template
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-col items-end md:items-center w-full">
          <nav
            style={glassStyle}
            className={`pointer-events-auto rounded-full px-2.5 py-2 flex items-center gap-1 transition-all duration-500 border ${light ? "border-slate-200" : "border-white/5"} ${scrolled ? (light ? "bg-white/80" : "bg-white/5") : "bg-transparent"}`}
          >
            <div className="hidden md:flex items-center gap-[2px]">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all duration-300 ${pathname === item.href
                        ? (light ? "text-primary bg-primary/10" : "text-white bg-white/10")
                        : (light ? "text-slate-600 hover:text-primary hover:bg-primary/5" : "text-zinc-300 hover:text-white hover:bg-white/5")
                        }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all duration-300 flex items-center gap-1.5 ${openDropdown === item.label
                        ? (light ? "text-primary bg-primary/10" : "text-white bg-white/10")
                        : (light ? "text-slate-600 hover:text-primary hover:bg-primary/5" : "text-zinc-300 hover:text-white hover:bg-white/5")
                        }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === item.label ? (light ? "rotate-180 text-primary" : "rotate-180 text-white") : (light ? "text-slate-400" : "text-zinc-400")
                          }`}
                      />
                    </button>
                  )}

                  <AnimatePresence>
                    {item.dropdown && openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        style={dropdownStyle}
                        className={`absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 border ${light ? 'border-slate-200' : 'border-white/5'} rounded-2xl py-2 min-w-[200px]`}
                      >
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`block px-4 py-2.5 text-[14px] font-medium ${light ? 'text-slate-600 hover:text-primary hover:bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/10'} transition-colors mx-2 rounded-xl`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <button
              className={`md:hidden p-2 rounded-full transition-colors ${light ? 'text-slate-800 hover:bg-primary/10' : 'text-zinc-300 hover:text-white hover:bg-white/10'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                style={glassStyle}
                className={`border ${light ? 'border-slate-200' : 'border-white/5'} rounded-2xl mt-4 w-full max-w-[90vw] sm:max-w-sm p-3 pointer-events-auto md:hidden`}>
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-[15px] font-medium ${light ? 'text-slate-600 hover:text-primary hover:bg-primary/5' : 'text-zinc-300 hover:text-white hover:bg-white/5'} transition-colors`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === item.label ? null : item.label
                            )
                          }
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium ${light ? 'text-slate-600 hover:text-primary hover:bg-primary/5' : 'text-zinc-300 hover:text-white hover:bg-white/5'} transition-colors`}
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${openDropdown === item.label ? (light ? 'rotate-180 text-primary':'rotate-180 text-white') : (light ? 'text-slate-400' : 'text-zinc-500')}`}
                          />
                        </button>
                        <AnimatePresence>
                          {openDropdown === item.label && item.dropdown && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4"
                            >
                              {item.dropdown.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={`block px-4 py-2.5 text-[14px] ${light ? 'text-slate-500 hover:text-primary' : 'text-zinc-400 hover:text-white'} transition-colors`}
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
