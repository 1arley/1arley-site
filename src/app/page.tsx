"use client";

import HeroSection from '@/components/hero/HeroSection'
import AboutSection from '@/components/about/AboutSection'
import SkillsSection from '@/components/skills/SkillsSection'
import ExperienceSection from '@/components/experience/ExperienceSection'
import ProjectsSection from '@/components/projects/ProjectsSection'
import BackendSection from '@/components/backend/BackendSection'
import ContactSection from '@/components/contact/ContactSection'
import TickerDivider from '@/components/effects/TickerDivider'
import { ClickSpark } from '@/components/animate-ui/click-spark'
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
    <ClickSpark
      className="relative"
      sparkColor="#ffffff"
      sparkSize={3}
      sparkRadius={16}
      sparkCount={7}
      duration={0.45}
    >
      <main>
        <HeroSection />
      <TickerDivider text={t.tickers.t1} />
      <AboutSection />
      <SkillsSection />
      <TickerDivider text={t.tickers.t3} />
      <ExperienceSection />
      <ProjectsSection />
      <BackendSection />
        <TickerDivider text={t.tickers.t5} />
        <ContactSection />
      </main>
    </ClickSpark>
  )
}
