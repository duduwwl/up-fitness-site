import Image from "next/image";
import { amenities, photos } from "@/content/site";
import { Reveal, RevealItem } from "./reveal";
import styles from "./structure.module.css";

export function Structure() {
  const p = photos.barbell;
  return (
    <section id="estrutura" className={`section ${styles.section}`} aria-labelledby="estrutura-title">
      <div className={`wrap ${styles.grid}`}>
        <figure className={styles.figure}>
          <div className={`arrow-frame ${styles.frame}`}>
            <Image
              className={`photo ${styles.img}`}
              src={p.src}
              width={p.width}
              height={p.height}
              alt={p.alt}
              sizes="(min-width: 1024px) 45vw, 90vw"
            />
          </div>
          <figcaption className="caption soft">{p.caption}</figcaption>
        </figure>

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
  );
}
