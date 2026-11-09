"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render(element: HTMLElement, options: { sitekey: string; callback(token: string): void; "expired-callback"(): void }): string;
      remove(widgetId: string): void;
    };
  }
}

export function Turnstile({ onToken }: { onToken(token: string): void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const host = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const render = useCallback(() => {
    if (!siteKey || !host.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(host.current, {
      sitekey: siteKey,
      callback: onToken,
      "expired-callback": () => onToken(""),
    });
  }, [onToken, siteKey]);

  useEffect(() => () => {
    if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
  }, []);

  if (!siteKey) return null;
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={render} onReady={render} /><div ref={host} /></>;
}
