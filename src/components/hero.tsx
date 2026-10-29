import Image from "next/image";
import { brand } from "@/content/site";
import { visitMessage, whatsappUrl } from "@/lib/links";
import { ArrowIcon } from "./icons";
import { OpenStatus } from "./open-status";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
      <div className={`wrap ${styles.intro}`}>
        <div>
          <h1 id="hero-title" className={`display ${styles.title}`}>Seu treino.<br /><span>Seu ritmo.</span><br />Dê um UP.</h1>
        </div>
        <div className={styles.copy}>
          <p className={styles.lede}>{brand.tagline}</p>
          <div className={styles.actions}>
            <a className="btn btn-yellow" href={whatsappUrl(visitMessage)} target="_blank" rel="noopener noreferrer">
              Quero conhecer <ArrowIcon /><span className="visually-hidden">(abre o WhatsApp em nova aba)</span>
            </a>
            <a className="text-link" href="#planos">Ver planos <ArrowIcon /></a>
          </div>
          <OpenStatus className={styles.status} />
        </div>
      </div>
      <figure className={`wrap ${styles.figure}`}>
        <div className={styles.imageFrame}>
          <Image src="/up-fitness-site/images/up-fitness-hero-ai.png" alt="Ilustração criada com IA: academia com equipamentos pretos e amarelos e pessoas treinando." width={1672} height={941} sizes="100vw" preload className={styles.image} />
        </div>
        <figcaption className={styles.caption}>Identidade UP Fitness. Imagem ilustrativa criada com IA; não retrata a unidade de Lavras.</figcaption>
      </figure>
    </section>
  );
}
