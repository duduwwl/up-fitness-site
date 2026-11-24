import styles from "./marquee.module.css";

// Only confirmed facts already shown elsewhere on the page (see src/content/site.ts).
const facts = [
  "Seg a sex das 4h30 à meia-noite",
  "Estacionamento gratuito",
  "Equipamentos importados",
  "Ambiente climatizado",
  "Gympass e TotalPass",
  "Área kids",
];

export function Marquee() {
  return (
    <div className={`on-yellow ${styles.band}`} role="region" aria-label="Destaques da UP Fitness Zona Sul">
      <ul className="visually-hidden">
        {facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      {/* Two identical tracks make the loop seamless; screen readers get the list above. */}
      <div className={styles.track} aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className={styles.group}>
            {facts.map((fact) => (
              <span key={fact} className={styles.item}>
                {fact}
                <svg className={styles.mark} viewBox="0 0 20 14" aria-hidden="true">
                  <path d="M1 13 10 2l9 11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
