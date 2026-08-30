import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Arthur Iarley — desenvolvedor full-stack, analista de projetos na Seed a Bit Tecnologia e CTO da SmartRU. Software com estrutura, do requisito à entrega.",
};

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
