import { TextEffects } from "./text-effects";
import Image from "next/image";
import { amenities, photos } from "@/content/site";
import { Reveal, RevealItem } from "./reveal";
import styles from "./structure.module.css";

export function Structure() {
  const primary = photos.barbell;
  const secondary = photos.dumbbells;
  return (
    <TextEffects>
    <section id="estrutura" className={`section ${styles.section}`} aria-labelledby="estrutura-title">
      <div className={`wrap ${styles.grid}`}>
        <Reveal className={styles.media}>
          <RevealItem scale as="figure" className={styles.figure}>
            <div className={`arrow-frame ${styles.frame}`}>
              <Image
                className={`photo ${styles.img}`}
                src={primary.src}
                width={primary.width}
                height={primary.height}
                alt={primary.alt}
                sizes="(min-width: 1024px) 42vw, 92vw"
              />
            </div>
            <figcaption className="visually-hidden">{primary.caption}</figcaption>
          </RevealItem>
          <RevealItem scale as="figure" className={styles.secondary}>
            <div className={`arrow-frame ${styles.secondaryFrame}`}>
              <Image
                className="photo"
                src={secondary.src}
                width={secondary.width}
                height={secondary.height}
                alt={secondary.alt}
                sizes="(min-width: 1024px) 18vw, 42vw"
              />
            </div>
            <figcaption className="visually-hidden">{secondary.caption}</figcaption>
          </RevealItem>
        </Reveal>

        <Reveal className={styles.body}>
          <RevealItem as="h2" className="display h2">
            <span id="estrutura-title">Dois andares de treino</span>
          </RevealItem>
          <RevealItem as="p" className={styles.intro}>
            A unidade Zona Sul foi montada para musculação: piso de treino em dois andares, ar
            climatizado e equipamentos importados.
          </RevealItem>
          <ul className={styles.points}>
            {amenities.map((a, i) => (
              <RevealItem as="li" key={a.title} className={styles.point}>
                <h3 className={styles.pointTitle}>
                  <span className={`bullet ${styles[`c${i % 3}`]}`} aria-hidden="true" />
                  {a.title}
                </h3>
                <p className="soft">{a.text}</p>
              </RevealItem>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
    </TextEffects>
  );
}

