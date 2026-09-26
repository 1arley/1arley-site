"use client";

import HeroSection from '@/components/hero/HeroSection'
import ProjectsSection from '@/components/projects/ProjectsSection'
import AboutSection from '@/components/about/AboutSection'
import ExperienceSection from '@/components/experience/ExperienceSection'
import SkillsSection from '@/components/skills/SkillsSection'
import BackendSection from '@/components/backend/BackendSection'
import ContactSection from '@/components/contact/ContactSection'
import TickerDivider from '@/components/effects/TickerDivider'
import { useLocale } from '@/lib/i18n'

export default function HomePage() {
  const { t } = useLocale();

  return (
    <main>
      <HeroSection />
      <TickerDivider text={t.tickers.t1} />
      <ProjectsSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <BackendSection />
      <ContactSection />
    </main>
  )
}
