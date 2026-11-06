"use client";

import { useEffect, useRef, useSyncExternalStore, useState, type FormEvent } from "react";
import { plans } from "@/content/site";
import { getPlanBySlug, planSlug } from "@/lib/plans";
import { whatsappUrl } from "@/lib/links";
import styles from "./checkout.module.css";

const subscribe = () => () => {};
const readQuery = () => new URLSearchParams(window.location.search).get("plano") ?? "";

export function Checkout() {
  const initialSlug = useSyncExternalStore(subscribe, readQuery, () => "");
  const [selection, setSlug] = useState<string | null>(null);
  const slug = selection ?? initialSlug;
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("pix");
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (step > 0) titleRef.current?.focus(); }, [step]);
  const plan = getPlanBySlug(slug);
  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep(2);
  }
  return <div className={styles.page}>
    <header className={styles.header}><a href="/up-fitness-site/">UP FITNESS</a><a href="/up-fitness-site/#planos">Voltar aos planos</a></header>
    <p className={styles.notice}>Demonstração — nenhum pagamento será realizado. Use dados fictícios.</p>
    <div className={styles.grid}>
      <section className={styles.content}>
        <p className={styles.eyebrow}>SEU PRÓXIMO UP</p>
        <h1 ref={titleRef} tabIndex={-1}>{["Seu treino começa aqui.", "Vamos conhecer você.", "Escolha como pagar.", "Tudo pronto para começar."][step]}</h1>
        <ol className={styles.steps}>{["Plano", "Seus dados", "Pagamento"].map((s, i) => <li key={s} aria-current={step === i ? "step" : undefined}>{i + 1}. {s}</li>)}</ol>
        {step === 0 && <><h2>Escolha sua rotina</h2><div className={styles.options}>{plans.map((p) => <button key={p.name} type="button" aria-pressed={slug === planSlug(p.name)} onClick={() => setSlug(planSlug(p.name))}><strong>{p.name}</strong><span>R$ {p.price}/mês</span><small>{p.schedule}</small></button>)}</div><button className={styles.primary} disabled={!plan} onClick={() => setStep(1)}>Continuar</button></>}
        {step === 1 && <form onSubmit={advance}><h2>Experimente o cadastro</h2><p>Os dados ficam apenas nesta tela e são descartados ao sair.</p><label>Nome fictício<input name="name" required minLength={2} autoComplete="off" /></label><label>E-mail de exemplo<input name="email" type="email" required autoComplete="off" /></label><label>Telefone de exemplo<input name="phone" type="tel" inputMode="numeric" required pattern="[0-9]{10,11}" title="Informe 10 ou 11 dígitos, com DDD, sem espaços." autoComplete="off" /></label><p className={styles.hint}>CPF será solicitado somente na contratação real.</p><button className={styles.primary}>Ir para pagamento</button><button type="button" onClick={() => setStep(0)}>Revisar plano</button></form>}
        {step === 2 && <><h2>Como você prefere pagar?</h2><div className={styles.options}><button aria-pressed={method === "pix"} onClick={() => setMethod("pix")}>Pix</button><button aria-pressed={method === "card"} onClick={() => setMethod("card")}>Cartão de crédito</button></div>{method === "pix" ? <div className={styles.payment}><strong>PIX · DEMONSTRAÇÃO</strong><p>Nenhuma cobrança foi gerada.</p><code>DEMO-UP-FITNESS-SEM-VALOR</code><small>Código ilustrativo. Inválido para pagamento.</small></div> : <div className={styles.payment}><strong>UP FITNESS · CARTÃO DEMONSTRATIVO</strong><p>•••• •••• •••• 0000</p><small>A etapa real usará um provedor seguro de pagamentos.</small></div>}<button className={styles.primary} onClick={() => setStep(3)}>Simular confirmação</button><button onClick={() => setStep(1)}>Voltar</button></>}
        {step === 3 && <div role="status"><h2>Simulação concluída</h2><p>Você escolheu o plano {plan?.name}. Nenhuma matrícula ou cobrança foi realizada.</p><a className={styles.primary} href={whatsappUrl(`Olá! Quero saber mais sobre o plano ${plan?.name ?? ""} da UP Fitness.`)} target="_blank" rel="noopener noreferrer">Conversar com a academia <span className="visually-hidden">(abre em nova aba)</span></a></div>}
      </section>
      <aside className={styles.summary}><p>UP FITNESS · ZONA SUL</p><h2>{plan ? `Plano ${plan.name}` : "Sua escolha"}</h2>{plan ? <><strong className={styles.price}>R$ {plan.price}<small>/mês</small></strong><p>{plan.schedule}</p><p>{plan.commitment}</p><ul>{plan.features.map((f) => <li key={f}>✓ {f}</li>)}</ul></> : <p>Selecione um plano para ver o resumo.</p>}<p className={styles.hint}>Condições, disponibilidade e valores devem ser confirmados com a unidade antes da contratação real.</p></aside>
    </div>
  </div>;
}
