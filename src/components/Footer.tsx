'use client';

import Link from "next/link";
import { Mail, Terminal } from "lucide-react";

const Footer = ({ light = false }: { light?: boolean }) => {
  const emailSubject = "Contato via 1arley";
  const emailBody = "Ola, gostaria de mais informacoes.";
  const mailtoHref = `mailto:contato@seu-dominio.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const footerClasses = {
    background: light ? "bg-white" : "bg-background",
    border: light ? "border-gray-200" : "border-border",
    text: light ? "text-gray-800" : "text-foreground",
    mutedText: light ? "text-gray-500" : "text-muted-foreground",
    hoverText: "hover:text-cyan",
    iconBorder: light ? "border-gray-300" : "border-border",
    iconHoverBorder: light ? "hover:border-cyan/50" : "hover:border-cyan/30"
  };

  return (
    <footer className={`border-t ${footerClasses.border} ${footerClasses.background}`}>
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
               <div className={`w-8 h-8 rounded-md ${light ? "bg-cyan-100" : "bg-cyan/10"} border ${light ? "border-cyan-200" : "border-cyan/20"} flex items-center justify-center`}>
                <Terminal className="w-4 h-4 text-cyan" />
              </div>
              <div className="flex flex-col">
                <span className={`font-display font-bold text-sm ${footerClasses.text} leading-none`}>1arley</span>
                <span className={`font-mono text-[10px] ${footerClasses.mutedText} leading-none`}>template</span>
              </div>
            </div>
            <p className={`text-sm ${footerClasses.mutedText} leading-relaxed`}>
              Template multi-domínio para projetos web.
            </p>
          </div>

          <div>
            <h4 className={`font-mono text-xs mb-4 uppercase tracking-widest ${footerClasses.mutedText}`}>
              Navegação
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className={`text-sm ${footerClasses.mutedText} ${footerClasses.hoverText} transition-colors`}>Home</Link>
              <Link href="/sobre" className={`text-sm ${footerClasses.mutedText} ${footerClasses.hoverText} transition-colors`}>Sobre</Link>
              <Link href="/faq" className={`text-sm ${footerClasses.mutedText} ${footerClasses.hoverText} transition-colors`}>FAQ</Link>
            </div>
          </div>

          <div>
            <h4 className={`font-mono text-xs mb-4 uppercase tracking-widest ${footerClasses.mutedText}`}>
              Admin
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/admin/content" className={`text-sm ${footerClasses.mutedText} ${footerClasses.hoverText} transition-colors`}>Conteúdo</Link>
              <Link href="/admin/team" className={`text-sm ${footerClasses.mutedText} ${footerClasses.hoverText} transition-colors`}>Equipe</Link>
              <Link href="/admin/links" className={`text-sm ${footerClasses.mutedText} ${footerClasses.hoverText} transition-colors`}>Links</Link>
              <Link href="/admin/users" className={`text-sm ${footerClasses.mutedText} ${footerClasses.hoverText} transition-colors`}>Usuários</Link>
            </div>
          </div>

          <div>
            <h4 className={`font-mono text-xs mb-4 uppercase tracking-widest ${footerClasses.mutedText}`}>
              Contato
            </h4>
            <div className="flex gap-3">
              <a
                href={mailtoHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Enviar email"
                className={`w-9 h-9 rounded-lg border ${footerClasses.iconBorder} flex items-center justify-center ${footerClasses.mutedText} ${footerClasses.hoverText} ${footerClasses.iconHoverBorder} transition-colors`}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className={`mt-3 text-sm ${footerClasses.mutedText}`}>contato@seu-dominio.com</p>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t ${footerClasses.border} text-center`}>
          <p className={`text-xs font-mono ${footerClasses.mutedText}`}>
            © {new Date().getFullYear()} 1arley Template — Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
