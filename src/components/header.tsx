"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { whatsappUrl, visitMessage } from "@/lib/links";
import { navItems } from "@/lib/nav";
import { ArrowIcon, Logo } from "./icons";
import styles from "./header.module.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    // Close if the viewport grows past the mobile layout while open.
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.bar}`}>
        <a href="#inicio" className={styles.brand} aria-label="UP Fitness, voltar ao início">
          <Logo />
        </a>

        <nav aria-label="Principal" className={styles.desktopNav}>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className={`btn btn-yellow ${styles.cta}`}
          href={whatsappUrl(visitMessage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp <span className="visually-hidden">(abre em nova aba)</span>
          <ArrowIcon />
        </a>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={open ? "menu-mobile" : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">{open ? "Fechar menu" : "Abrir menu"}</span>
          <span className={styles.burger} data-open={open} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="menu-mobile"
            aria-label="Menu"
            className={styles.mobileNav}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="wrap">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={whatsappUrl(visitMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  WhatsApp <span className="visually-hidden">(abre em nova aba)</span>
                  <ArrowIcon />
                </a>
              </li>
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
