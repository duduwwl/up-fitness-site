"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { AreaPhoto } from "@/content/site";
import { Reveal, RevealItem } from "./reveal";
import styles from "./equipment.module.css";

// Grid of photos; each opens a native <dialog> (Escape and focus return come free).
export function EquipmentGallery({ photos }: { photos: AreaPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const photo = photos[index];

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const step = (delta: number) => setIndex((i) => (i + delta + photos.length) % photos.length);

  return (
    <>
      <Reveal className={styles.gallery}>
        {photos.map((p, i) => (
          <RevealItem scale as="figure" key={p.src} className={styles.figure}>
            <button type="button" className={styles.frame} onClick={() => open(i)}>
              <Image
                className="photo"
                src={p.src}
                width={p.width}
                height={p.height}
                alt={p.alt}
                sizes="(min-width: 1000px) 24vw, (min-width: 640px) 31vw, 47vw"
              />
              <span className={styles.zoom} aria-hidden="true">+</span>
              <span className="visually-hidden">Ampliar foto</span>
            </button>
          </RevealItem>
        ))}
      </Reveal>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="Foto ampliada dos equipamentos"
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        <figure className={styles.viewer}>
          <Image className={styles.big} src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} sizes="90vw" />
          <figcaption className={styles.count}>
            {index + 1} / {photos.length}
          </figcaption>
        </figure>
        <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)} aria-label="Foto anterior">
          ‹
        </button>
        <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)} aria-label="Próxima foto">
          ›
        </button>
        <button type="button" className={styles.close} onClick={() => dialogRef.current?.close()} aria-label="Fechar">
          ×
        </button>
      </dialog>
    </>
  );
}
