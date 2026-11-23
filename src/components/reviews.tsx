import { TextEffects } from "./text-effects";
import { googleReviews } from "@/content/site";
import { Reveal, RevealItem } from "./reveal";
import styles from "./reviews.module.css";

const ratingText = googleReviews.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 });
const fillPercent = (googleReviews.rating / 5) * 100;

export function Reviews() {
  return (
    <TextEffects>
      <section id="avaliacoes" className={`section ${styles.section}`} aria-labelledby="avaliacoes-title">
        <div className={`wrap ${styles.grid}`}>
          <Reveal className={styles.intro}>
            <RevealItem as="h2" className="display h2">
              <span id="avaliacoes-title">Feedbacks do Google</span>
            </RevealItem>
            <RevealItem as="p" className={styles.lede}>
              Quem treina na UP avaliou a unidade no Google. A nota vem de mais de {googleReviews.count}{" "}
              avaliações reais de alunos — confira você mesmo.
            </RevealItem>
            <RevealItem>
              <div className={styles.quotes}>
                {googleReviews.quotes.map((quote) => (
                  <span key={quote} className={styles.quote}>“{quote}”</span>
                ))}
              </div>
              <a className="btn btn-yellow" href={googleReviews.url} target="_blank" rel="noopener noreferrer">
                Ver avaliações no Google <span className="visually-hidden">(abre em nova aba)</span>
              </a>
            </RevealItem>
          </Reveal>

          <Reveal className={styles.scoreWrap}>
            <RevealItem
              className={styles.score}
              aria-label={`Nota ${ratingText} de 5 no Google, ${googleReviews.count} avaliações`}
            >
              <strong className={`display ${styles.number}`}>{ratingText}</strong>
              <span className={styles.outOf}>de 5</span>
              <span className={styles.stars} aria-hidden="true">
                <span className={styles.starsBase}>★★★★★</span>
                <span className={styles.starsFill} style={{ width: `${fillPercent}%` }}>★★★★★</span>
              </span>
              <span className={styles.count}>{googleReviews.count} avaliações no Google</span>
            </RevealItem>
          </Reveal>
        </div>
      </section>
    </TextEffects>
  );
}
