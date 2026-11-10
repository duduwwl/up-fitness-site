import { TextEffects } from "./text-effects";
import { checkedAt, plans } from "@/content/site";
import { planSlug } from "@/lib/plans";
import { sitePath } from "@/lib/paths";
import { Reveal, RevealItem } from "./reveal";
import styles from "./plans.module.css";

const checkedDate = new Date(`${checkedAt}T12:00:00`).toLocaleDateString("pt-BR");

function CheckIcon() {
  return (
    <svg className={styles.check} viewBox="0 0 20 20" aria-hidden="true">
      <path d="m4 10 4 4 8-9" />
    </svg>
  );
}

export function Plans() {
  return (
    <TextEffects>
      <section id="planos" className={`section on-light ${styles.section}`} aria-labelledby="planos-title">
        <div className="wrap">
          <Reveal className={styles.intro}>
            <RevealItem as="p" className={styles.eyebrow}>Planos UP Fitness</RevealItem>
            <RevealItem as="h2" className={`display h2 ${styles.heading}`}>
              <span id="planos-title">Um plano para cada rotina</span>
            </RevealItem>
            <RevealItem as="p" className={styles.lede}>
              Treine no meio do dia por menos ou escolha horário livre com valores menores nos planos longos.
            </RevealItem>
          </Reveal>

          <ol className={styles.tiles}>
            {plans.map((plan, index) => (
              <RevealItem
                scale
                as="li"
                key={plan.name}
                className={`${styles.tile} ${index === 0 ? styles.economic : ""} ${index === plans.length - 1 ? styles.best : ""}`}
              >
                <div className={styles.tileBody}>
                  <div className={styles.cardHead}>
                    <h3 className={styles.name}>Plano {plan.name}</h3>
                    {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
                  </div>
                  <div className={styles.price}>
                    <span className={styles.currency}>R$</span>
                    <strong>{plan.price}</strong>
                    <span className={styles.perMonth}>/mês</span>
                  </div>
                  <p className={styles.schedule}>{plan.schedule}</p>

                  <a
                    className={styles.cta}
                    data-ui
                    href={sitePath(`/contratacao/?plano=${planSlug(plan.name)}`)}
                  >
                    Escolher plano {plan.name}
                  </a>

                  <p className={styles.includes}>Inclui</p>
                  <ul className={styles.features}>
                    {plan.features.map((feature) => (
                      <li key={feature}><CheckIcon /><span>{feature}</span></li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </ol>

          <p className={`small soft ${styles.note}`}>
            Valores consultados em {checkedDate}. Adesão, fidelidade, reajustes e disponibilidade
            do plano econômico devem ser confirmados na assinatura. A unidade também aceita Gympass e TotalPass.
          </p>
        </div>
      </section>
    </TextEffects>
  );
}
