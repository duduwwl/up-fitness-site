import Image from "next/image";
import { parkingInfo } from "@/content/site";
import { Reveal, RevealItem } from "./reveal";
import styles from "./parking.module.css";

export function Parking() {
  return (
    <section id="estacionamento" className={`section ${styles.section}`} aria-labelledby="estacionamento-title">
      <div className={`wrap ${styles.inner}`}>
        <Reveal>
          <RevealItem as="h2" className="display h2">
            <span id="estacionamento-title">Estacionamento próprio</span>
          </RevealItem>
          <RevealItem as="p" className={styles.intro}>
            {parkingInfo.intro}
          </RevealItem>
          <ul className={styles.points}>
            {parkingInfo.points.map((point) => (
              <li key={point.title} className={styles.point}>
                <h3 className={styles.pointTitle}>
                  <span className={`bullet ${styles.bullet}`} aria-hidden="true" />
                  {point.title}
                </h3>
                <p className="soft">{point.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.media}>
          <RevealItem scale as="figure" className={styles.figure}>
            <div className={styles.frame}>
              <Image
                className="photo"
                src={parkingInfo.photo.src}
                width={parkingInfo.photo.width}
                height={parkingInfo.photo.height}
                alt={parkingInfo.photo.alt}
                sizes="(min-width: 900px) 92vw, 92vw"
              />
            </div>
            <figcaption className="visually-hidden">
              Estacionamento próprio e gratuito para alunos da UP Fitness Zona Sul.
            </figcaption>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
