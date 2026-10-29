import Image from "next/image";
import { address, contact, holidayHours, hours, mapsUrl, photos } from "@/content/site";
import { rangeText as range } from "@/lib/hours";
import { visitMessage, whatsappUrl } from "@/lib/links";
import { ArrowIcon } from "./icons";
import { OpenStatus } from "./open-status";
import { Reveal, RevealItem } from "./reveal";
import styles from "./unit.module.css";

export function Unit() {
  return (
    <section id="unidade" className={`section ${styles.section}`} aria-labelledby="unidade-title">
      <div className={`wrap ${styles.grid}`}>
        <Reveal className={styles.info}>
          <RevealItem as="h2" className="display h2">
            <span id="unidade-title">Unidade Zona Sul</span>
          </RevealItem>

          <RevealItem>
            <address className={styles.address}>
              {address.street}
              <br />
              {address.district}, {address.city} – {address.state}
              <br />
              CEP {address.postalCode}
            </address>
            <p className="soft small">{address.reference}.</p>
            <div className={styles.actions}>
              <a className="btn btn-yellow" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                Abrir no Google Maps
                <span className="visually-hidden">(abre em nova aba)</span>
                <ArrowIcon />
              </a>
              <a className="text-link" href={whatsappUrl(visitMessage)} target="_blank" rel="noopener noreferrer">
                WhatsApp {contact.phoneDisplay}
                <span className="visually-hidden">(abre em nova aba)</span>
                <ArrowIcon />
              </a>
            </div>
          </RevealItem>

          <RevealItem className={styles.hoursBlock}>
            <h3 className="h3">Horários</h3>
            <OpenStatus className={styles.status} />
            <dl className={styles.hours}>
              {hours.map((h) => (
                <div key={h.label} className={styles.row}>
                  <dt>{h.label}</dt>
                  <dd>{range(h.open, h.close)}</dd>
                </div>
              ))}
              <div className={styles.row}>
                <dt>{holidayHours.label}</dt>
                <dd>{range(holidayHours.open, holidayHours.close)}</dd>
              </div>
            </dl>
          </RevealItem>
        </Reveal>

        <div className={styles.photos}>
          {[photos.church, photos.fig].map((p, i) => (
            <figure key={p.src} className={i === 0 ? styles.big : styles.small}>
              <div className={`arrow-frame ${styles.frame}`}>
                <Image
                  className="photo"
                  src={p.src}
                  width={p.width}
                  height={p.height}
                  alt={p.alt}
                  sizes={i === 0 ? "(min-width: 1024px) 40vw, 90vw" : "(min-width: 1024px) 22vw, 50vw"}
                />
              </div>
              <figcaption className="caption soft">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
