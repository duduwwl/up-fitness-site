"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { plans } from "@/content/site";
import { getPlanBySlug, planSlug } from "@/lib/plans";
import { sitePath } from "@/lib/paths";
import { whatsappUrl } from "@/lib/links";
import { Turnstile } from "./turnstile";
import styles from "./checkout.module.css";

const subscribe = () => () => {};
const readQuery = () => new URLSearchParams(window.location.search).get("plano") ?? "";
const initialDetails = { fullName: "", email: "", phone: "", consent: false };

export function Checkout() {
  const initialSlug = useSyncExternalStore(subscribe, readQuery, () => "");
  const [selection, setSlug] = useState<string | null>(null);
  const slug = selection ?? initialSlug;
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<"pix" | "card">("pix");
  const [details, setDetails] = useState(initialDetails);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ requestId: string; managementCode: string } | null>(null);
  const idempotencyKey = useRef<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (step > 0) titleRef.current?.focus(); }, [step]);
  const plan = getPlanBySlug(slug);

  function captureDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStep(2);
  }

  const setToken = useCallback((token: string) => setTurnstileToken(token), []);

  async function submitRequest() {
    if (!plan) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(sitePath("/api/membership-requests/"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          planSlug: planSlug(plan.name),
          ...details,
          paymentMethod: method,
          turnstileToken,
          idempotencyKey: idempotencyKey.current ??= crypto.randomUUID(),
          website: "",
        }),
      });
      const result = await response.json() as { requestId?: string; managementCode?: string; error?: string };
      if (!response.ok || !result.requestId || !result.managementCode) throw new Error(result.error ?? "Não foi possível enviar.");
      setReceipt({ requestId: result.requestId, managementCode: result.managementCode });
      setStep(3);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível enviar.");
    } finally {
      setSubmitting(false);
    }
  }

  return <div className={styles.page}>
    <header className={styles.header}><a href={sitePath("/")}>UP FITNESS</a><a href={sitePath("/#planos")}>Voltar aos planos</a></header>
    <p className={styles.notice}>Demonstração — nenhum pagamento será realizado. O pedido será enviado à academia.</p>
    <div className={styles.grid}>
      <section className={styles.content}>
        <p className={styles.eyebrow}>SEU PRÓXIMO UP</p>
        <h1 ref={titleRef} tabIndex={-1}>{["Seu treino começa aqui.", "Vamos conhecer você.", "Escolha como pagar.", "Pedido recebido."][step]}</h1>
        <ol className={styles.steps}>{["Plano", "Seus dados", "Pagamento"].map((s, i) => <li key={s} aria-current={step === i ? "step" : undefined}>{i + 1}. {s}</li>)}</ol>
        {step === 0 && <><h2>Escolha sua rotina</h2><div className={styles.options}>{plans.map((p) => <button key={p.name} type="button" aria-pressed={slug === planSlug(p.name)} onClick={() => setSlug(planSlug(p.name))}><strong>{p.name}</strong><span>R$ {p.price}/mês</span><small>{p.schedule}</small></button>)}</div><button className={styles.primary} disabled={!plan} onClick={() => setStep(1)}>Continuar</button></>}
        {step === 1 && <form onSubmit={captureDetails}><h2>Dados para a academia entrar em contato</h2><label>Nome completo<input name="name" required minLength={2} maxLength={100} autoComplete="name" value={details.fullName} onChange={(e) => setDetails({ ...details, fullName: e.target.value })} /></label><label>E-mail<input name="email" type="email" required maxLength={254} autoComplete="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} /></label><label>Telefone com DDD<input name="phone" type="tel" inputMode="tel" required pattern="[0-9 ()+\-]{10,20}" autoComplete="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} /></label><label className={styles.consent}><input type="checkbox" required checked={details.consent} onChange={(e) => setDetails({ ...details, consent: e.target.checked })} />Autorizo o uso destes dados para responder ao pedido. Li a <a href={sitePath("/privacidade/")}>política de privacidade</a>.</label><p className={styles.hint}>Não informe CPF nem dados de cartão. Eles não são necessários nesta demonstração.</p><button className={styles.primary}>Ir para pagamento</button><button type="button" onClick={() => setStep(0)}>Revisar plano</button></form>}
        {step === 2 && <><h2>Como você prefere pagar?</h2><div className={styles.options}><button type="button" aria-pressed={method === "pix"} onClick={() => setMethod("pix")}>Pix</button><button type="button" aria-pressed={method === "card"} onClick={() => setMethod("card")}>Cartão de crédito</button></div>{method === "pix" ? <div className={styles.payment}><strong>PIX · DEMONSTRAÇÃO</strong><p>Nenhuma cobrança será gerada.</p><code>DEMO-UP-FITNESS-SEM-VALOR</code><small>Código ilustrativo. Inválido para pagamento.</small></div> : <div className={styles.payment}><strong>UP FITNESS · CARTÃO DEMONSTRATIVO</strong><p>•••• •••• •••• 0000</p><small>Não coletamos número, validade ou CVV.</small></div>}<Turnstile onToken={setToken} />{error && <p className={styles.error} role="alert">{error}</p>}<button className={styles.primary} disabled={submitting} onClick={() => void submitRequest()}>{submitting ? "Enviando…" : "Enviar pedido demonstrativo"}</button><button type="button" onClick={() => setStep(1)}>Voltar</button></>}
        {step === 3 && receipt && <div role="status"><h2>Solicitação enviada</h2><p>A academia recebeu seu interesse no plano {plan?.name}. Nenhuma matrícula ou cobrança foi realizada.</p><div className={styles.receipt}><p><strong>ID:</strong> <code>{receipt.requestId}</code></p><p><strong>Código de gestão:</strong> <code>{receipt.managementCode}</code></p><p>Guarde os dois códigos para exportar ou excluir seus dados.</p></div><a href={sitePath("/privacidade/")}>Gerenciar meus dados</a><br /><a className={styles.primary} href={whatsappUrl(`Olá! Enviei o pedido ${receipt.requestId} sobre o plano ${plan?.name ?? ""}.`)} target="_blank" rel="noopener noreferrer">Conversar com a academia <span className="visually-hidden">(abre em nova aba)</span></a></div>}
      </section>
      <aside className={styles.summary}><p>UP FITNESS · ZONA SUL</p><h2>{plan ? `Plano ${plan.name}` : "Sua escolha"}</h2>{plan ? <><strong className={styles.price}>R$ {plan.price}<small>/mês</small></strong><p>{plan.schedule}</p><ul>{plan.features.map((f) => <li key={f}>✓ {f}</li>)}</ul></> : <p>Selecione um plano para ver o resumo.</p>}<p className={styles.hint}>Condições, disponibilidade e valores devem ser confirmados com a unidade antes da contratação real.</p></aside>
    </div>
  </div>;
}
