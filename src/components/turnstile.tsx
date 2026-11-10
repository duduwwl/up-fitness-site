"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render(element: HTMLElement, options: {
        sitekey: string;
        callback(token: string): void;
        "expired-callback"(): void;
        "error-callback"(code: string): boolean;
      }): string;
      reset(widgetId: string): void;
      remove(widgetId: string): void;
    };
  }
}

export function Turnstile({ onToken }: { onToken(token: string): void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const host = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);
  const render = useCallback(() => {
    if (!siteKey || !host.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(host.current, {
      sitekey: siteKey,
      callback: (token) => {
        setFailed(false);
        onToken(token);
      },
      "expired-callback": () => onToken(""),
      "error-callback": () => {
        onToken("");
        setFailed(true);
        return true;
      },
    });
  }, [onToken, siteKey]);

  useEffect(() => () => {
    if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
  }, []);

  function retry() {
    setFailed(false);
    if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
    else render();
  }

  if (!siteKey) return null;
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={render} onReady={render} /><div ref={host} />{failed && <p role="alert">A verificação de segurança não carregou. Desative VPN ou bloqueadores de anúncio e <button type="button" onClick={retry}>tente de novo</button>.</p>}</>;
}
