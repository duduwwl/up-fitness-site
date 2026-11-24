"use client";

import { TextEffects } from "./text-effects";
import { useEffect, useRef } from "react";
import { brand } from "@/content/site";
import { visitMessage, whatsappUrl } from "@/lib/links";
import styles from "./hero.module.css";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    videoRef.current?.pause();
  }, []);

  return (
    <TextEffects>
      <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/up-fitness-site/images/hero-gym-poster.webp"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source media="(max-width: 767px)" src="/up-fitness-site/videos/hero-gym-mobile.mp4" type="video/mp4" />
          <source src="/up-fitness-site/videos/hero-gym.mp4" type="video/mp4" />
        </video>

        <div className={`wrap ${styles.intro}`}>
          <h1 id="hero-title" className={`display ${styles.title}`}>Dê um UP</h1>
          <p className={styles.lede}>{brand.tagline}</p>
          <div className={styles.actions}>
            <a className="btn btn-yellow" href={whatsappUrl(visitMessage)} target="_blank" rel="noopener noreferrer">
              Conhecer a UP <span className="visually-hidden">(abre em nova aba)</span>
            </a>
            <a className="text-link" href="#planos">Ver planos</a>
          </div>
        </div>
        <a className={styles.scrollCue} href="#estrutura" aria-label="Rolar para a estrutura">
          <span className={styles.scrollLine} aria-hidden="true" />
        </a>
      </section>
    </TextEffects>
  );
}
