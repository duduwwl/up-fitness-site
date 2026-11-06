import { TextEffects } from "./text-effects";
import { address, contact, holidayHours, hours, mapsUrl } from "@/content/site";
import { rangeText as range } from "@/lib/hours";
import { visitMessage, whatsappUrl } from "@/lib/links";
import { OpenStatus } from "./open-status";
import { Reveal, RevealItem } from "./reveal";
import styles from "./unit.module.css";

export function Unit() {
  return (
    <TextEffects>
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
              </a>
              <a className="text-link" href={whatsappUrl(visitMessage)} target="_blank" rel="noopener noreferrer">
                WhatsApp {contact.phoneDisplay}
                <span className="visually-hidden">(abre em nova aba)</span>
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

        <div className={styles.map}>
          <iframe title="Localização da UP Fitness Zona Sul em Lavras" loading="lazy"
            src={`https://maps.google.com/maps?q=${encodeURIComponent("UP Fitness Rua Kennedy Santos 20 Lavras MG")}&output=embed`}
            referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Ver rota até a UP <span className="visually-hidden">(abre em nova aba)</span></a>
        </div>
      </div>
    </section>
    </TextEffects>
  );
}

