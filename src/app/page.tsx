"use client";

import HeroSection from '@/components/hero/HeroSection'
import AboutSection from '@/components/about/AboutSection'
import SkillsSection from '@/components/skills/SkillsSection'
import ExperienceSection from '@/components/experience/ExperienceSection'
import ProjectsSection from '@/components/projects/ProjectsSection'
import BackendSection from '@/components/backend/BackendSection'
import ContactSection from '@/components/contact/ContactSection'
import TickerDivider from '@/components/effects/TickerDivider'
import { useLocale } from '@/lib/i18n'

/**
 * HOME — ROCKSTAR MONOCHROME v2
 * One signature WebGL effect per section, separated by CSS ticker dividers.
 * Impact arc: HERO (stage) → ABOUT (artist) → SKILLS (gear)
 * → EXPERIENCE (build log) → PROJECTS (records) → BACKEND (console) →
 * CONTACT (finale).
 */
export default function HomePage() {
  const { t } = useLocale();
  return (
    <main>
      <HeroSection />
      <TickerDivider text={t.tickers.t1} />
      <AboutSection />
      <TickerDivider text={t.tickers.t2} />
      <SkillsSection />
      <TickerDivider text={t.tickers.t3} />
      <ExperienceSection />
      <ProjectsSection />
      <TickerDivider text={t.tickers.t4} />
      <BackendSection />
      <TickerDivider text={t.tickers.t5} />
      <ContactSection />
    </main>
  )
}
