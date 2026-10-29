import Image from "next/image";
import { brand } from "@/content/site";
import { visitMessage, whatsappUrl } from "@/lib/links";
import { ArrowIcon } from "./icons";
import { OpenStatus } from "./open-status";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title" aria-describedby="hero-caption">
      <Image src="/up-fitness-site/images/up-fitness-hero-ai.png" alt="" fill sizes="100vw" preload className={styles.image} />
      <div className={`wrap ${styles.intro}`}>
        <h1 id="hero-title" className={`display ${styles.title}`}>Dê um UP</h1>
        <p className={styles.lede}>{brand.tagline}</p>
        <div className={styles.actions}>
          <a className="btn btn-yellow" href={whatsappUrl(visitMessage)} target="_blank" rel="noopener noreferrer">
            Conhecer a UP <ArrowIcon /><span className="visually-hidden">(abre o WhatsApp em nova aba)</span>
          </a>
          <a className="text-link" href="#planos">Ver planos <ArrowIcon /></a>
        </div>
        <OpenStatus className={styles.status} />
      </div>
      <p id="hero-caption" className={styles.caption}>Imagem ilustrativa criada com IA. Não retrata a unidade de Lavras.</p>
    </section>
  );
}
