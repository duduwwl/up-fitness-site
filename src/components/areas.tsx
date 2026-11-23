"use client";

import { useState } from "react";
import Image from "next/image";
import { areas } from "@/content/site";
import { Reveal, RevealItem } from "./reveal";
import styles from "./areas.module.css";

export function Areas() {
  const [active, setActive] = useState(areas[0].id);
  const current = areas.find((a) => a.id === active) ?? areas[0];
  const index = areas.findIndex((a) => a.id === active);

  return (
    <section id="areas" className={`section ${styles.section}`} aria-labelledby="areas-title">
      <div className={`wrap ${styles.inner}`}>
        <Reveal>
          <RevealItem as="h2" className="display h2">
            <span id="areas-title">Áreas da academia</span>
          </RevealItem>
          <RevealItem as="p" className={styles.intro}>
            A UP vai além do piso de treino: cada área foi montada para caber na sua rotina —
            das crianças à espera tranquila antes do treino.
          </RevealItem>

          <RevealItem>
            <div className={styles.tabs} role="tablist" aria-label="Áreas da academia">
              {areas.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  role="tab"
                  id={`tab-${area.id}`}
                  aria-selected={area.id === active}
                  aria-controls={`panel-${area.id}`}
                  tabIndex={area.id === active ? 0 : -1}
                  className={styles.tab}
                  data-active={area.id === active}
                  onClick={() => setActive(area.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const next =
                        e.key === "ArrowRight"
                          ? (index + 1) % areas.length
                          : (index - 1 + areas.length) % areas.length;
                      setActive(areas[next].id);
                      document.getElementById(`tab-${areas[next].id}`)?.focus();
                    }
                  }}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </RevealItem>
        </Reveal>

        <div
          key={current.id}
          id={`panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${current.id}`}
          className={styles.panel}
          data-single={current.photos.length === 0}
        >
          {current.photos.length > 0 && (
            <div className={styles.photos}>
              {current.photos.map((photo, i) => (
                <figure key={photo.src} className={styles.figure} data-first={i === 0}>
                  <div className={styles.frame}>
                    <Image
                      className="photo"
                      src={photo.src}
                      width={photo.width}
                      height={photo.height}
                      alt={photo.alt}
                      sizes="(min-width: 900px) 40vw, 92vw"
                    />
                  </div>
                </figure>
              ))}
            </div>
          )}

          <div className={styles.body}>
            <h3 className={`display ${styles.areaTitle}`}>{current.title}</h3>
            <p className={styles.areaIntro}>{current.intro}</p>
            <ul className={styles.points}>
              {current.points.map((point) => (
                <li key={point.title} className={styles.point}>
                  <h4 className={styles.pointTitle}>
                    <span className={`bullet ${styles.bullet}`} aria-hidden="true" />
                    {point.title}
                  </h4>
                  <p className="soft">{point.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
