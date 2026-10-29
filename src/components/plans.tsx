import { TextEffects } from "./text-effects";
import { checkedAt, contact, plans } from "@/content/site";
import { Reveal, RevealItem } from "./reveal";
import styles from "./plans.module.css";

const checkedDate = new Date(`${checkedAt}T12:00:00`).toLocaleDateString("pt-BR");

export function Plans() {
  return (
    <TextEffects>
    <section id="planos" className={`section on-light ${styles.section}`} aria-labelledby="planos-title">
      <div className="wrap">
        <Reveal className={styles.stage}>
          <RevealItem as="h2" className={`display h2 ${styles.heading}`}>
            <span id="planos-title">Fique mais, pague menos</span>
          </RevealItem>
          <ol className={styles.tiles}>
            {plans.map((p, i) => (
              <RevealItem as="li" key={p.name} className={`${styles.tile} ${styles[`t${i}`]}`}>
                <div className={styles.tileBody}>
                  <p className={styles.name}>{p.name}</p>
                  {/* Shown exactly as the official sales page shows it (amount + installments). */}
                  <div className={styles.priceEffect}>
                    <p className={styles.price}>
                    {p.name === "Bimestral" ? `${p.installments} × ` : ""}
                    <span className={styles.currency}>R$</span> {p.price}
                    </p>
                  </div>
                  <ul className={styles.lines}>
                    <li>
                      {p.installments} parcelas, {p.months} meses
                    </li>
                    <li>Horário livre</li>
                    <li>Valor de tabela R$ {p.listPrice}</li>
                  </ul>
                </div>
                <a
                  className={styles.strip}
                  data-ui
                  href={contact.salesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Assinar o {p.name.toLowerCase()}
                  <span className="visually-hidden"> na página oficial de vendas (abre em nova aba)</span>
                </a>
              </RevealItem>
            ))}
          </ol>
        </Reveal>
        <p className={`small soft ${styles.note}`}>
          Valores da página oficial de vendas da UP Fitness Zona Sul, consultada em {checkedDate}.
          Adesão, fidelidade e reajustes são informados na assinatura. A unidade também aceita
          Gympass e TotalPass.
        </p>
      </div>
    </section>
    </TextEffects>
  );
}



