import HeroSection from '@/components/hero/HeroSection'
import AboutSection from '@/components/about/AboutSection'
import SkillsSection from '@/components/skills/SkillsSection'
import ExperienceSection from '@/components/experience/ExperienceSection'
import ProjectsSection from '@/components/projects/ProjectsSection'
import BackendSection from '@/components/backend/BackendSection'
import ContactSection from '@/components/contact/ContactSection'
import TickerDivider from '@/components/effects/TickerDivider'

/**
 * HOME — ROCKSTAR MONOCHROME v2
 * One signature WebGL effect per section, separated by CSS ticker dividers.
 * Impact arc: HERO (stage) → ABOUT (artist) → SKILLS (gear)
 * → EXPERIENCE (build log) → PROJECTS (records) → BACKEND (console) →
 * CONTACT (finale).
 */
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TickerDivider text="FULL-STACK · SOUND · WEBGL · GRAIN · ROCK" />
      <AboutSection />
      <TickerDivider text="PRETO & BRANCO · SEM COMPROMISSO · BRUTAL" />
      <SkillsSection />
      <TickerDivider text="TOOLS · REACT · NODE · THREE · MOTION" />
      <ExperienceSection />
      <ProjectsSection />
      <TickerDivider text="O PONTO ALTO · O GRÃO · O PALCO · O RUIDO" />
      <BackendSection />
      <TickerDivider text="VAMOS TOCAR JUNTOS · SEM COR · SEM CONCESSÃO" />
      <ContactSection />
    </main>
  )
}
