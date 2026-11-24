import { serviceInfo } from "@/content/site";
import { visitMessage, whatsappUrl } from "@/lib/links";
import { Reveal, RevealItem } from "./reveal";
import styles from "./service.module.css";

export function Service() {
  return (
    <section id="atendimento" className={`section ${styles.section}`} aria-labelledby="atendimento-title">
      <div className={`wrap ${styles.inner}`}>
        <Reveal className={styles.head}>
          <RevealItem as="h2" className="display h2">
            <span id="atendimento-title">Atendimento de perto</span>
          </RevealItem>
          <RevealItem as="p" className={styles.intro}>
            {serviceInfo.intro}
          </RevealItem>
        </Reveal>

        <Reveal>
          <ul className={styles.points}>
            {serviceInfo.points.map((point) => (
              <RevealItem as="li" key={point.title} className={styles.point}>
                <h3 className={styles.pointTitle}>
                  <span className={`bullet ${styles.bullet}`} aria-hidden="true" />
                  {point.title}
                </h3>
                <p className="soft">{point.text}</p>
              </RevealItem>
            ))}
          </ul>
          <RevealItem>
            <a className="btn btn-yellow" href={whatsappUrl(visitMessage)} target="_blank" rel="noopener noreferrer">
              Falar com a equipe <span className="visually-hidden">(abre o WhatsApp em nova aba)</span>
            </a>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
