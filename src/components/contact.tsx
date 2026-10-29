"use client";

import { TextEffects } from "./text-effects";
import { useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import {
  MESSAGE_MAX,
  NAME_MAX,
  buildContactMessage,
  interests,
  periods,
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "@/lib/contact-message";
import { whatsappUrl } from "@/lib/links";
import { contact } from "@/content/site";
import { ArrowIcon } from "./icons";
import styles from "./contact.module.css";

const empty: ContactInput = { name: "", interest: "", period: "", message: "" };

export function Contact() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [opened, setOpened] = useState(false);

  const set = (key: keyof ContactInput) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateContact(values);
    // Commit aria-invalid/aria-describedby before focusing so screen readers announce the error.
    flushSync(() => setErrors(found));
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`c-${first}`)?.focus();
      setOpened(false);
      return;
    }
    const url = whatsappUrl(buildContactMessage(values));
    // No "noopener" feature: with it window.open always returns null, hiding a real pop-up block.
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url; // pop-up blocked: open in the same tab
    setOpened(true);
  }

  const describedBy = (key: keyof ContactInput) => (errors[key] ? `c-${key}-error` : undefined);

  return (
    <TextEffects>
    <section id="contato" className={`section ${styles.section}`} aria-labelledby="contato-title">
      <div className="wrap">
        <div className={`${styles.coupon} on-yellow`}>
          <div className={styles.left}>
            <h2 id="contato-title" className={`display ${styles.title}`}>
              Marque sua visita
            </h2>
            <p className={styles.note}>
              Preencha e o WhatsApp abre com a mensagem pronta para a equipe da UP. O site não
              guarda nenhum dado. Prefere ligar ou chamar direto? {contact.phoneDisplay}.
            </p>
          </div>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="c-name">Seu nome</label>
              <input
                id="c-name"
                name="name"
                autoComplete="given-name"
                maxLength={NAME_MAX}
                required
                value={values.name}
                onChange={(e) => set("name")(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={describedBy("name")}
              />
              {errors.name && <p id="c-name-error" className={styles.error}>{errors.name}</p>}
            </div>

            <div className={styles.pair}>
              <div className={styles.field}>
                <label htmlFor="c-interest">Assunto</label>
                <select
                  id="c-interest"
                  name="interest"
                  autoComplete="off"
                  required
                  value={values.interest}
                  onChange={(e) => set("interest")(e.target.value)}
                  aria-invalid={!!errors.interest}
                  aria-describedby={describedBy("interest")}
                >
                  <option value="">Escolha</option>
                  {interests.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                {errors.interest && <p id="c-interest-error" className={styles.error}>{errors.interest}</p>}
              </div>
              <div className={styles.field}>
                <label htmlFor="c-period">Melhor período</label>
                <select
                  id="c-period"
                  name="period"
                  autoComplete="off"
                  required
                  value={values.period}
                  onChange={(e) => set("period")(e.target.value)}
                  aria-invalid={!!errors.period}
                  aria-describedby={describedBy("period")}
                >
                  <option value="">Escolha</option>
                  {periods.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                {errors.period && <p id="c-period-error" className={styles.error}>{errors.period}</p>}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="c-message">Mensagem (opcional)</label>
              <textarea
                id="c-message"
                name="message"
                autoComplete="off"
                rows={3}
                maxLength={MESSAGE_MAX}
                value={values.message}
                onChange={(e) => set("message")(e.target.value)}
                aria-invalid={!!errors.message}
                aria-describedby={describedBy("message")}
              />
              {errors.message && <p id="c-message-error" className={styles.error}>{errors.message}</p>}
            </div>

            <button type="submit" className={`btn btn-dark ${styles.submit}`}>
              Abrir conversa no WhatsApp
              <span className="visually-hidden">(abre em nova aba)</span>
              <ArrowIcon />
            </button>
            <p className={styles.feedback} role="status">
              {opened && "O WhatsApp foi aberto com sua mensagem. Toque em enviar por lá para falar com a equipe."}
            </p>
          </form>
        </div>
      </div>
    </section>
    </TextEffects>
  );
}

