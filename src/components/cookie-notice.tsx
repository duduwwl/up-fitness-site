"use client";

import { useSyncExternalStore } from "react";
import { sitePath } from "@/lib/paths";
import styles from "./cookie-notice.module.css";

const KEY = "up-fitness-cookie-notice";
const listeners = new Set<() => void>();
let dismissedNow = false;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function isDismissed() {
  if (dismissedNow) return true;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function dismiss() {
  dismissedNow = true;
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // Storage blocked: the notice stays closed until the page reloads.
  }
  listeners.forEach((listener) => listener());
}

export function CookieNotice() {
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  if (dismissed) return null;
  return (
    <aside className={styles.notice} aria-label="Aviso de cookies">
      <p>
        Este site não usa cookies de publicidade nem de rastreamento. Guardamos só preferências essenciais no seu navegador. O mapa do Google e a verificação de segurança da Cloudflare podem definir cookies próprios. <a href={sitePath("/privacidade/")}>Saiba mais</a>
      </p>
      <button type="button" onClick={dismiss}>Entendi</button>
    </aside>
  );
}
