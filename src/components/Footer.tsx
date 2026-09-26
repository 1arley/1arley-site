"use client";

import Link from "next/link";
import { BriefcaseBusiness, Code2, Mail } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/15 bg-black">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 py-10 sm:px-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <Link href="/" className="inline-flex min-h-11 items-center gap-3">
            <span className="grid h-9 w-9 place-items-center bg-white font-mono text-xs font-bold text-black">
              &gt;_
            </span>
            <span className="font-display text-3xl uppercase text-white">
              1arley
            </span>
          </Link>
          <p className="prose-read mt-4 max-w-md text-sm text-white/55">
            {t.footer.desc}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:col-span-6 md:justify-end">
          <a
            href="mailto:arthuriarleydev@gmail.com?subject=Contato%20via%20portfolio"
            className="icon-link"
            aria-label={t.footer.sendEmail}
            title={t.footer.sendEmail}
          >
            <Mail size={18} />
          </a>
          <a
            href="https://github.com/1arley"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            aria-label="GitHub"
            title="GitHub"
          >
            <Code2 size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/arthuriarley"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <BriefcaseBusiness size={18} />
          </a>
        </div>

        <div className="border-t border-white/15 pt-5 md:col-span-12 md:flex md:items-center md:justify-between">
          <p className="font-mono text-[10px] uppercase text-white/55">
            © {year} Arthur Iarley
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase text-white/55 md:mt-0">
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
