import { TextEffects } from "./text-effects";
import Image from "next/image";
import { photos } from "@/content/site";
import styles from "./band.module.css";

/** Full-width photo band between the two halves of the page, cut by the UP arrow. */
export function Band() {
  const p = photos.plates;
  return (
    <TextEffects>
    <figure className={styles.band}>
      <div className={styles.frame}>
        <Image
          className={`photo ${styles.img}`}
          src={p.src}
          width={p.width}
          height={p.height}
          alt={p.alt}
          sizes="100vw"
        />
      </div>
      <figcaption className={`wrap caption soft ${styles.caption}`}>{p.caption}</figcaption>
    </figure>
    </TextEffects>
  );
}

