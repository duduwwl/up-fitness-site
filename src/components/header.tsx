"use client";

import { TextEffects } from "./text-effects";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { whatsappUrl, visitMessage } from "@/lib/links";
import { navItems } from "@/lib/nav";
import { Logo } from "./icons";
import { contact } from "@/content/site";
import { SocialIcon } from "./social-icon";
import styles from "./header.module.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Fundo com blur + linha de progresso de leitura no topo.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        document.documentElement.style.setProperty("--scroll-progress", String(progress));
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Link ativo: a seção visível acende no menu.
    const ids = navItems.map((item) => item.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

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
    <TextEffects>
    <header className={styles.header} data-scrolled={scrolled}>
      <div className={`wrap ${styles.bar}`}>
        <a href="#inicio" className={styles.brand} aria-label="UP Fitness, voltar ao início">
          <Logo />
        </a>

        <nav aria-label="Principal" className={styles.desktopNav}>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} data-active={active === item.href}>
                  {item.label}
                </a>
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
          <SocialIcon kind="whatsapp" /><span className="visually-hidden">WhatsApp (abre em nova aba)</span>
        </a>
        <a className={styles.social} href={contact.instagramUnit} target="_blank" rel="noopener noreferrer"><SocialIcon kind="instagram" /><span className="visually-hidden">Instagram (abre em nova aba)</span></a>

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
                </a>
              </li>
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
    </TextEffects>
  );
}
