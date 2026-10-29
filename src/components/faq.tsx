import Image from "next/image";
import { faqs, photos } from "@/content/site";
import { Reveal, RevealItem } from "./reveal";
import styles from "./faq.module.css";

export function Faq() {
  const p = photos.dumbbells;
  return (
    <section id="duvidas" className={`section on-light ${styles.section}`} aria-labelledby="duvidas-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.side}>
          <h2 id="duvidas-title" className="display h2">
            Dúvidas frequentes
          </h2>
          <figure className={styles.figure}>
            <div className={`arrow-frame ${styles.frame}`}>
              <Image
                className="photo"
                src={p.src}
                width={p.width}
                height={p.height}
                alt={p.alt}
                sizes="(min-width: 1024px) 28vw, 60vw"
              />
            </div>
            <figcaption className="caption soft">{p.caption}</figcaption>
          </figure>
        </div>

        <Reveal className={styles.list}>
          {faqs.map((f) => (
            <RevealItem key={f.q}>
              <details name="faq" className={styles.item}>
                <summary className={styles.q}>
                  <span>{f.q}</span>
                  <span className={styles.plus} aria-hidden="true" />
                </summary>
                <p className={styles.a}>{f.a}</p>
              </details>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
