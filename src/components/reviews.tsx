import { TextEffects } from "./text-effects";
import { googleReviews } from "@/content/site";
import { Reveal, RevealItem } from "./reveal";
import styles from "./reviews.module.css";

export function Reviews() {
  return (
    <TextEffects>
      <section id="avaliacoes" className={`section ${styles.section}`} aria-labelledby="avaliacoes-title">
        <div className="wrap">
          <Reveal className={styles.head}>
            <RevealItem as="h2" className="display h2">
              <span id="avaliacoes-title">Feedbacks</span>
            </RevealItem>
            <RevealItem as="p" className={styles.lede}>
              O que quem treina na UP escreveu sobre a unidade — avaliações reais publicadas no Google.
            </RevealItem>
          </Reveal>

          <Reveal className={styles.grid}>
            {googleReviews.testimonials.map((review) => (
              <RevealItem as="figure" key={review.name} className={styles.card}>
                <blockquote className={styles.quote}>{review.text}</blockquote>
                <figcaption className={styles.author}>
                  <span className={styles.name}>{review.name}</span>
                </figcaption>
              </RevealItem>
            ))}
          </Reveal>

          <Reveal>
            <RevealItem>
              <a className="btn btn-yellow" href={googleReviews.url} target="_blank" rel="noopener noreferrer">
                Ver avaliações no Google <span className="visually-hidden">(abre em nova aba)</span>
              </a>
            </RevealItem>
          </Reveal>
        </div>
      </section>
    </TextEffects>
  );
}
