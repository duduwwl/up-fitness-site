import { PrivacyManager } from "@/components/privacy-manager";
import { sitePath } from "@/lib/paths";
import styles from "@/components/checkout.module.css";

export default function PrivacyPage() {
  return <main id="conteudo" className={styles.page}>
    <header className={styles.header}><a href={sitePath("/")}>UP FITNESS</a><a href={sitePath("/")}>Voltar ao site</a></header>
    <div className={styles.grid}>
      <section className={styles.content}>
        <p className={styles.eyebrow}>PRIVACIDADE</p><h1>Seus dados, suas escolhas.</h1>
        <p>Guardamos nome, e-mail, telefone, plano, forma de pagamento demonstrativa e consentimento para responder ao pedido.</p>
        <p>Não coletamos CPF, senha ou dados de cartão. Os dados expiram em 180 dias. O código entregue após o envio permite exportação e exclusão imediata.</p>
        <h2>Gerenciar uma solicitação</h2><PrivacyManager />
      </section>
      <aside className={styles.summary}><h2>Finalidade e acesso</h2><p>Somente a equipe autorizada usa os dados para responder ao interesse na matrícula.</p><p>Supabase hospeda o banco. Vercel executa o endpoint. Cloudflare Turnstile ajuda a bloquear abuso.</p><p>Para correção ou dúvidas, fale pelo WhatsApp oficial.</p></aside>
    </div>
  </main>;
}
