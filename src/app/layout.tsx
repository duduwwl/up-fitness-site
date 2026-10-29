import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { MotionRoot } from "@/components/reveal";
import { hours } from "@/content/site";
import { rangeText } from "@/lib/hours";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["800"],
});

const text = Barlow({
  variable: "--font-text",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const weekday = hours[0];
const description = `Academia de musculação na Zona Sul de Lavras (MG): dois andares climatizados, equipamentos importados, aberta de ${weekday.label.toLowerCase()} das ${rangeText(weekday.open, weekday.close)}. Planos com horário livre.`;

export const metadata: Metadata = {
  title: "UP Fitness Zona Sul | Academia em Lavras, MG",
  description,
  applicationName: "UP Fitness",
  openGraph: {
    title: "UP Fitness Zona Sul · Lavras",
    description,
    locale: "pt_BR",
    type: "website",
    siteName: "UP Fitness",
  },
  twitter: { card: "summary_large_image", title: "UP Fitness Zona Sul · Lavras", description },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${text.variable}`}>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <noscript>
          {/* Without script, entrance animations never run: keep everything visible. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
