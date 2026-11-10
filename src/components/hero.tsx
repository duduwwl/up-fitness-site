"use client";

import { TextEffects } from "./text-effects";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/content/site";
import { visitMessage, whatsappUrl } from "@/lib/links";
import styles from "./hero.module.css";
import { sitePath } from "@/lib/paths";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    videoRef.current?.pause();
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPlaying(false));
    else video.pause();
  };

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
          poster={sitePath("/images/hero-gym-poster.webp")}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source media="(max-width: 767px)" src={sitePath("/videos/hero-gym-mobile.mp4")} type="video/mp4" />
          <source src={sitePath("/videos/hero-gym.mp4")} type="video/mp4" />
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

        <button className={styles.videoControl} type="button" onClick={toggleVideo} aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}>
          <span className={playing ? styles.pauseIcon : styles.playIcon} aria-hidden="true" />
          <span>{playing ? "Pausar" : "Reproduzir"}</span>
        </button>
      </section>
    </TextEffects>
  );
}
