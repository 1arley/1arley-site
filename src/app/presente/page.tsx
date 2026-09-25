import { Caveat, Lilita_One } from "next/font/google";
import { ChocolateGift } from "@/components/presente/ChocolateGift";

const fontWonka = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-wonka",
  display: "swap",
});

const fontHand = Caveat({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata = {
  title: "Um chocolate pra você",
  description: "Tem um chocolate virtual aqui. Será que veio premiado?",
  robots: { index: false, follow: false },
};

export default function PresentePage() {
  return <ChocolateGift className={`${fontWonka.variable} ${fontHand.variable}`} />;
}
