import { brand } from "@/content/site";
import { visitMessage, whatsappUrl } from "@/lib/links";
import { ArrowIcon } from "./icons";
import { OpenStatus } from "./open-status";
import styles from "./hero.module.css";

// Back folders of the stack; each tab is the UP arrow and opens its section.
const folders = [
  { href: "#estrutura", label: "Estrutura", tone: "f1" },
  { href: "#planos", label: "Planos", tone: "f2" },
  { href: "#unidade", label: "Horários e endereço", tone: "f3" },
  { href: "#duvidas", label: "Dúvidas", tone: "f4" },
];

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
      <div className={`wrap ${styles.intro}`}>
        <h1 id="hero-title" className={`display ${styles.title}`}>
          Dê um UP
        </h1>
        <p className={styles.lede}>{brand.tagline}</p>
      </div>

      <nav aria-label="Seções" className={styles.stack}>
        {folders.map((f, i) => (
          <a key={f.href} href={f.href} className={`${styles.folder} ${styles[f.tone]}`} data-i={i}>
            <span className={styles.tab}>{f.label}</span>
          </a>
        ))}
        <div className={`${styles.folder} ${styles.front} on-yellow`}>
          <span className={styles.tab} aria-hidden="true">
            Visite
          </span>
          <div className={`wrap ${styles.frontInner}`}>
            <a
              className="btn btn-dark"
              href={whatsappUrl(visitMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar visita pelo WhatsApp
              <span className="visually-hidden">(abre em nova aba)</span>
              <ArrowIcon />
            </a>
            <OpenStatus className={styles.status} />
          </div>
        </div>
      </nav>
    </section>
  );
}
