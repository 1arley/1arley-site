export type Locale = "pt" | "en";

export interface TimelineItem {
  year: string;
  title: string;
  body: string;
  tag: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  kind: string;
  body: string;
  img: string;
  alt: string;
  tags: string[];
  href: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  items: string[];
}

export interface StackItem {
  name: string;
  desc: string;
}

export interface BackendEndpoint {
  method: string;
  path: string;
  note: string;
}

export interface BackendFeature {
  title: string;
  body: string;
}

export interface Dict {
  hero: {
    label: string;
    subtitle: string;
    ctaProjects: string;
    ctaAbout: string;
    aboutLink: string;
    ariaLabel: string;
    coords: string;
    place: string;
  };
  about: {
    intro: string;
    title1: string;
    title2: string;
    p1Before: string;
    p1After: string;
    p2: string;
    stackLabel: string;
    stack: StackItem[];
    cta: string;
    figLabel: string;
    figSpec: string;
  };
  skills: {
    label: string;
    title: string;
    categories: SkillCategory[];
  };
  sobre: {
    label: string;
    title1: string;
    title2: string;
    introLabel: string;
    introTitle: string;
  };
  experience: {
    label: string;
    title: string;
    timeline: TimelineItem[];
  };
  projects: {
    label: string;
    title: string;
    count: string;
    projects: ProjectItem[];
  };
  backend: {
    label: string;
    title1: string;
    title2: string;
    body: string;
    features: BackendFeature[];
    endpoints: BackendEndpoint[];
    cta: string;
  };
  contact: {
    label: string;
    title1: string;
    title2: string;
    title3: string;
    subtitle: string;
    cta: string;
    aboutCta: string;
    status: string;
  };
  footer: {
    desc: string;
    navLabel: string;
    home: string;
    about: string;
    contactLabel: string;
    sendEmail: string;
    rights: string;
  };
  navbar: {
    home: string;
    about: string;
    ariaNav: string;
    ariaOpen: string;
    ariaClose: string;
    ariaMobile: string;
  };
  tickers: {
    t1: string;
    t2: string;
    t3: string;
    t4: string;
    t5: string;
  };
  preloader: {
    loading: string;
    loadingTag: string;
    tagline: string;
  };
}

export const dict: Record<Locale, Dict> = {
  pt: {
    hero: {
      label: "FULL-STACK · ANALISTA DE PROJETOS",
      subtitle:
        "Desenvolvedor full-stack e analista de projetos, com foco em arquitetura sólida, APIs, segurança e interfaces com identidade forte.",
      ctaProjects: "VER PROJETOS",
      ctaAbout: "SOBRE MIM",
      aboutLink: "SOBRE",
      ariaLabel: "Arthur Iarley — portfólio",
      coords: "8°03′S / 34°52′W",
      place: "RECIFE · PE",
    },
    about: {
      intro: "// INTRODUÇÃO",
      title1: "Interface é",
      title2: "performance.",
      p1Before: "Sou",
      p1After:
        " — estudante de Sistemas de Informação na UFRPE, desenvolvedor backend/full-stack, Analista de Projetos na Seed a Bit Tecnologia e CTO da SmartRU. Meu foco é transformar requisitos em software sólido, seguro e com boa estrutura.",
      p2: "Atuo com APIs, arquitetura, autenticação, modelagem de dados, frontend quando necessário e decisões de produto que mantêm o sistema consistente do início ao fim.",
      stackLabel: "STACK — O QUE EU TOCO",
      stack: [
        { name: "TypeScript", desc: "Tipagem estrita" },
        { name: "Node.js", desc: "Backend e tooling" },
        { name: "Python", desc: "Projetos e APIs" },
        { name: "Next.js", desc: "Frontend moderno" },
        { name: "React", desc: "Interfaces componentizadas" },
        { name: "NestJS", desc: "APIs modulares" },
        { name: "PostgreSQL", desc: "Modelagem relacional" },
        { name: "Prisma", desc: "ORM e migrations" },
      ],
      cta: "VER PERFIL COMPLETO",
      figLabel: "FIG.01 — MONO",
      figSpec: "P&B · 735×727",
    },
    skills: {
      label: "// SKILLS · STACK REAL",
      title: "Tecnologias e categorias",
      categories: [
        {
          id: "01",
          title: "BACKEND",
          items: [
            "TypeScript",
            "Node.js",
            "NestJS",
            "Python",
            "APIs REST",
            "Segurança",
          ],
        },
        {
          id: "02",
          title: "DADOS",
          items: [
            "PostgreSQL",
            "Prisma",
            "SQLite",
            "Modelagem relacional",
            "Migrations",
            "Validação",
          ],
        },
        {
          id: "03",
          title: "FRONTEND",
          items: [
            "Next.js",
            "React",
            "Tailwind CSS",
            "UI componentizada",
            "Responsividade",
            "Acessibilidade",
          ],
        },
        {
          id: "04",
          title: "DEVOPS",
          items: ["Docker", "CI/CD", "Swagger/OpenAPI", "JWT", "Git", "Linux"],
        },
      ],
    },
    sobre: {
      label: "// SOBRE · ARTHUR IARLEY",
      title1: "Arthur",
      title2: "Iarley.",
      introLabel: "// QUEM SOU",
      introTitle: "Software com estrutura, do requisito à entrega.",
    },
    experience: {
      label: "// TRAJETÓRIA · PERFIL",
      title: "Experiência e formação",
      timeline: [
        {
          year: "ATUAL",
          title: "Analista de Projetos — Seed a Bit Tecnologia",
          body: "Atuação profissional com foco em desenvolvimento e apoio a soluções reais em produção.",
          tag: "PROJETOS · PROD",
        },
        {
          year: "ATUAL",
          title: "CTO — SmartRU",
          body: "Responsável pelas decisões de arquitetura de software e pela evolução técnica da plataforma.",
          tag: "ARQUITETURA · PRODUTO",
        },
        {
          year: "FORMAÇÃO",
          title: "Sistemas de Informação — UFRPE",
          body: "Base acadêmica em computação aplicada, engenharia de software e sistemas de informação.",
          tag: "UFRPE",
        },
        {
          year: "FOCO",
          title: "Backend, APIs e segurança",
          body: "Trabalho com autenticação, autorização, modelagem de dados, módulos backend e integrações REST.",
          tag: "NODE · NEST · SQL",
        },
      ],
    },
    projects: {
      label: "// PROJETOS · PORTFÓLIO",
      title: "Projetos reais",
      count: "[ 04 PROJETOS ]",
      projects: [
        {
          id: "01",
          title: "AnimesIce",
          kind: "PLATAFORMA · STREAMING",
          body: "Plataforma de streaming de animes em produção: frontend Next.js/React e backend NestJS com streaming via URLs assinadas, JWT, Prisma e PostgreSQL.",
          img: "/projects/animesice.png",
          alt: "Home do AnimesIce em produção",
          tags: ["NEXT.JS", "NESTJS", "STREAMING"],
          href: "https://animesice.app",
        },
        {
          id: "02",
          title: "Ornn",
          kind: "OPEN SOURCE · AGENT SKILLS",
          body: "25 skills de engenharia para agentes de IA (auditoria, segurança, UX e qualidade) distribuídas via npm com zero dependências.",
          img: "/projects/ornn.png",
          alt: "Página npm do Ornn",
          tags: ["PYTHON", "NPM", "AGENTS"],
          href: "https://www.npmjs.com/package/ornn-forge",
        },
        {
          id: "03",
          title: "SmartRU",
          kind: "PRODUTO · CTO",
          body: "Como CTO, lidero a arquitetura de software do RU Sem Desperdício — decisões de arquitetura, backend e frontend em produção.",
          img: "/projects/smartru.png",
          alt: "Acesso do SmartRU em produção",
          tags: ["NESTJS", "ARQUITETURA", "PRODUTO"],
          href: "https://smartru.com.br",
        },
        {
          id: "04",
          title: "BCC UFRPE",
          kind: "SITE · DEVOPS + FRONTEND",
          body: "Contribuições em DevOps/infraestrutura e frontend no portal oficial do curso de Ciência da Computação da UFRPE (Seed a Bit).",
          img: "/projects/ufrpebcc.png",
          alt: "Home do portal BCC UFRPE",
          tags: ["DEVOPS", "FRONTEND", "UFRPE"],
          href: "https://ufrpebcc.com.br",
        },
      ],
    },
    backend: {
      label: "// BACKEND · ENGENHARIA",
      title1: "Engenharia",
      title2: "por trás do produto.",
      body: "Trabalho com backend real, modelagem de dados, autenticação, autorização, integrações REST e decisões de arquitetura que sustentam o produto de ponta a ponta.",
      features: [
        {
          title: "Autenticação e sessão",
          body: "Fluxos com login, refresh token e controle de acesso para áreas administrativas.",
        },
        {
          title: "Arquitetura de dados",
          body: "Modelagem com PostgreSQL, Prisma e estrutura pensada para crescer com o produto.",
        },
        {
          title: "Execução em produção",
          body: "Docker, CI/CD e disciplina de TypeScript para manter entrega confiável.",
        },
      ],
      endpoints: [
        { method: "AUTH", path: "JWT + refresh token", note: "login / session" },
        { method: "DATA", path: "PostgreSQL + Prisma", note: "migrations / modelagem" },
        { method: "REST", path: "APIs modulares", note: "posts / team / links / users" },
        { method: "DEVOPS", path: "Docker + CI/CD", note: "ambientes e deploy" },
        { method: "SEC", path: "Autorização & roles", note: "admin / guards" },
        { method: "OPS", path: "TypeScript + strict", note: "qualidade / consistência" },
      ],
      cta: "VER ARQUITETURA",
    },
    contact: {
      label: "CONTATO · LINKS REAIS",
      title1: "Vamos",
      title2: "conversar",
      title3: "sobre oportunidades.",
      subtitle:
        "Aberto a oportunidades, colaborações e conversas sobre produto, backend, frontend e arquitetura. Se fizer sentido, vamos falar.",
      cta: "ENVIAR E-MAIL",
      aboutCta: "SOBRE",
      status: "aberto a oportunidades",
    },
    footer: {
      desc: "Portfólio com informações reais de Arthur Iarley: experiência, projetos, skills e contato.",
      navLabel: "Navegação",
      home: "Home",
      about: "Sobre",
      contactLabel: "Contato",
      sendEmail: "Enviar e-mail",
      rights: "Todos os direitos reservados",
    },
    navbar: {
      home: "Início",
      about: "Sobre",
      ariaNav: "Navegação principal",
      ariaOpen: "Abrir menu",
      ariaClose: "Fechar menu",
      ariaMobile: "Navegação móvel",
    },
    tickers: {
      t1: "FULL-STACK · ANALISTA DE PROJETOS · NESTJS · PRISMA · ROCK",
      t2: "PRETO & BRANCO · SEM COMPROMISSO · BRUTAL",
      t3: "TOOLS · TYPESCRIPT · NODE · NEST · PYTHON",
      t4: "O PONTO ALTO · O GRÃO · O PALCO · O RUIDO",
      t5: "VAMOS CONVERSAR · SEM COR · SEM CONCESSÃO",
    },
    preloader: {
      loading: "CARREGANDO…",
      loadingTag: "[ carregando ]",
      tagline: "SEM COR · SEM CONCESSÃO",
    },
  },
  en: {
    hero: {
      label: "FULL-STACK · PROJECT ANALYST",
      subtitle:
        "Full-stack developer and project analyst focused on solid architecture, APIs, security, and interfaces with strong identity.",
      ctaProjects: "SEE PROJECTS",
      ctaAbout: "ABOUT ME",
      aboutLink: "ABOUT",
      ariaLabel: "Arthur Iarley — portfolio",
      coords: "8°03′S / 34°52′W",
      place: "RECIFE · BR",
    },
    about: {
      intro: "// INTRODUCTION",
      title1: "Interface is",
      title2: "performance.",
      p1Before: "I'm",
      p1After:
        " — an Information Systems student at UFRPE, backend/full-stack developer, Project Analyst at Seed a Bit Tecnologia, and CTO at SmartRU. My focus is turning requirements into solid, secure, well-structured software.",
      p2: "I work with APIs, architecture, authentication, data modeling, frontend when needed, and product decisions that keep the system consistent from start to finish.",
      stackLabel: "STACK — WHAT I PLAY",
      stack: [
        { name: "TypeScript", desc: "Strict typing" },
        { name: "Node.js", desc: "Backend & tooling" },
        { name: "Python", desc: "Projects & APIs" },
        { name: "Next.js", desc: "Modern frontend" },
        { name: "React", desc: "Component-based interfaces" },
        { name: "NestJS", desc: "Modular APIs" },
        { name: "PostgreSQL", desc: "Relational modeling" },
        { name: "Prisma", desc: "ORM & migrations" },
      ],
      cta: "VIEW FULL PROFILE",
      figLabel: "FIG.01 — MONO",
      figSpec: "B&W · 735×727",
    },
    skills: {
      label: "// SKILLS · REAL STACK",
      title: "Technologies & categories",
      categories: [
        {
          id: "01",
          title: "BACKEND",
          items: [
            "TypeScript",
            "Node.js",
            "NestJS",
            "Python",
            "REST APIs",
            "Security",
          ],
        },
        {
          id: "02",
          title: "DATA",
          items: [
            "PostgreSQL",
            "Prisma",
            "SQLite",
            "Relational modeling",
            "Migrations",
            "Validation",
          ],
        },
        {
          id: "03",
          title: "FRONTEND",
          items: [
            "Next.js",
            "React",
            "Tailwind CSS",
            "Component-based UI",
            "Responsiveness",
            "Accessibility",
          ],
        },
        {
          id: "04",
          title: "DEVOPS",
          items: ["Docker", "CI/CD", "Swagger/OpenAPI", "JWT", "Git", "Linux"],
        },
      ],
    },
    sobre: {
      label: "// ABOUT · ARTHUR IARLEY",
      title1: "Arthur",
      title2: "Iarley.",
      introLabel: "// WHO I AM",
      introTitle: "Structured software, from requirement to delivery.",
    },
    experience: {
      label: "// CAREER · PROFILE",
      title: "Experience & education",
      timeline: [
        {
          year: "PRESENT",
          title: "Project Analyst — Seed a Bit Tecnologia",
          body: "Professional work focused on development and support for real production solutions.",
          tag: "PROJECTS · PROD",
        },
        {
          year: "PRESENT",
          title: "CTO — SmartRU",
          body: "Responsible for software architecture decisions and the technical evolution of the platform.",
          tag: "ARCHITECTURE · PRODUCT",
        },
        {
          year: "EDUCATION",
          title: "Information Systems — UFRPE",
          body: "Academic foundation in applied computing, software engineering, and information systems.",
          tag: "UFRPE",
        },
        {
          year: "FOCUS",
          title: "Backend, APIs & security",
          body: "I work with authentication, authorization, data modeling, backend modules, and REST integrations.",
          tag: "NODE · NEST · SQL",
        },
      ],
    },
    projects: {
      label: "// PROJECTS · PORTFOLIO",
      title: "Real projects",
      count: "[ 04 PROJECTS ]",
      projects: [
        {
          id: "01",
          title: "AnimesIce",
          kind: "PLATFORM · STREAMING",
          body: "Anime streaming platform in production: Next.js/React frontend and NestJS backend with signed-URL streaming, JWT, Prisma, and PostgreSQL.",
          img: "/projects/animesice.png",
          alt: "AnimesIce home in production",
          tags: ["NEXT.JS", "NESTJS", "STREAMING"],
          href: "https://animesice.app",
        },
        {
          id: "02",
          title: "Ornn",
          kind: "OPEN SOURCE · AGENT SKILLS",
          body: "25 engineering skills for AI agents (audit, security, UX, and quality) distributed via npm with zero dependencies.",
          img: "/projects/ornn.png",
          alt: "Ornn npm page",
          tags: ["PYTHON", "NPM", "AGENTS"],
          href: "https://www.npmjs.com/package/ornn-forge",
        },
        {
          id: "03",
          title: "SmartRU",
          kind: "PRODUCT · CTO",
          body: "As CTO, I lead the software architecture of RU Sem Desperdício — architecture decisions, backend, and frontend in production.",
          img: "/projects/smartru.png",
          alt: "SmartRU access in production",
          tags: ["NESTJS", "ARCHITECTURE", "PRODUCT"],
          href: "https://smartru.com.br",
        },
        {
          id: "04",
          title: "BCC UFRPE",
          kind: "SITE · DEVOPS + FRONTEND",
          body: "DevOps/infrastructure and frontend contributions on the official portal of UFRPE's Computer Science program (Seed a Bit).",
          img: "/projects/ufrpebcc.png",
          alt: "BCC UFRPE portal home",
          tags: ["DEVOPS", "FRONTEND", "UFRPE"],
          href: "https://ufrpebcc.com.br",
        },
      ],
    },
    backend: {
      label: "// BACKEND · ENGINEERING",
      title1: "Engineering",
      title2: "behind the product.",
      body: "I work with real backend, data modeling, authentication, authorization, REST integrations, and architecture decisions that support the product end to end.",
      features: [
        {
          title: "Authentication & sessions",
          body: "Login flows, refresh tokens, and access control for admin areas.",
        },
        {
          title: "Data architecture",
          body: "Modeling with PostgreSQL, Prisma, and structure designed to grow with the product.",
        },
        {
          title: "Production delivery",
          body: "Docker, CI/CD, and TypeScript discipline for reliable delivery.",
        },
      ],
      endpoints: [
        { method: "AUTH", path: "JWT + refresh token", note: "login / session" },
        { method: "DATA", path: "PostgreSQL + Prisma", note: "migrations / modeling" },
        { method: "REST", path: "Modular APIs", note: "posts / team / links / users" },
        { method: "DEVOPS", path: "Docker + CI/CD", note: "environments & deploy" },
        { method: "SEC", path: "Authorization & roles", note: "admin / guards" },
        { method: "OPS", path: "TypeScript + strict", note: "quality / consistency" },
      ],
      cta: "VIEW ARCHITECTURE",
    },
    contact: {
      label: "CONTACT · REAL LINKS",
      title1: "Let's",
      title2: "talk",
      title3: "about opportunities.",
      subtitle:
        "Open to opportunities, collaborations, and conversations about product, backend, frontend, and architecture. If it makes sense, let's talk.",
      cta: "SEND EMAIL",
      aboutCta: "ABOUT",
      status: "open to opportunities",
    },
    footer: {
      desc: "Portfolio with real Arthur Iarley information: experience, projects, skills, and contact.",
      navLabel: "Navigation",
      home: "Home",
      about: "About",
      contactLabel: "Contact",
      sendEmail: "Send email",
      rights: "All rights reserved",
    },
    navbar: {
      home: "Home",
      about: "About",
      ariaNav: "Main navigation",
      ariaOpen: "Open menu",
      ariaClose: "Close menu",
      ariaMobile: "Mobile navigation",
    },
    tickers: {
      t1: "FULL-STACK · PROJECT ANALYST · NESTJS · PRISMA · ROCK",
      t2: "BLACK & WHITE · NO COMPROMISE · BRUTAL",
      t3: "TOOLS · TYPESCRIPT · NODE · NEST · PYTHON",
      t4: "THE HIGHLIGHT · THE GRAIN · THE STAGE · THE NOISE",
      t5: "LET'S TALK · NO COLOR · NO COMPROMISE",
    },
    preloader: {
      loading: "LOADING…",
      loadingTag: "[ loading ]",
      tagline: "NO COLOR · NO COMPROMISE",
    },
  },
};
