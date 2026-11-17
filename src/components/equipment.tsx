import Image from "next/image";
import { equipmentInfo } from "@/content/site";
import { Reveal, RevealItem } from "./reveal";
import styles from "./equipment.module.css";

export function Equipment() {
  return (
    <section id="equipamentos" className={`section ${styles.section}`} aria-labelledby="equipamentos-title">
      <div className={`wrap ${styles.inner}`}>
        <Reveal>
          <RevealItem as="h2" className="display h2">
            <span id="equipamentos-title">Equipamentos importados</span>
          </RevealItem>
          <RevealItem as="p" className={styles.intro}>
            {equipmentInfo.intro}
          </RevealItem>
          <ul className={styles.points}>
            {equipmentInfo.points.map((point) => (
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

        <Reveal className={styles.gallery}>
          {equipmentInfo.photos.map((photo) => (
            <RevealItem scale as="figure" key={photo.src} className={styles.figure}>
              <div className={styles.frame}>
                <Image
                  className="photo"
                  src={photo.src}
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                  sizes="(min-width: 900px) 30vw, 45vw"
                />
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
