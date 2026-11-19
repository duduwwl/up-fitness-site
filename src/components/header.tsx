"use client";

import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { whatsappUrl, visitMessage } from "@/lib/links";
import { headerNavItems } from "@/lib/nav";
import { Logo } from "./icons";
import { contact } from "@/content/site";
import { OpenStatus } from "./open-status";
import { SocialIcon } from "./social-icon";
import styles from "./header.module.css";

function UpArrow() {
  return (
    <svg className={styles.upArrow} viewBox="0 0 12 14" aria-hidden="true" focusable="false">
      <path d="M6 13V2M1.5 6.5 6 2l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Compact bar after leaving the top, hide while reading down, return on any scroll up.
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty("--scroll-progress", String(max > 0 ? Math.min(1, y / max) : 0));
        setScrolled(y > 8);
        if (Math.abs(y - lastY) > 6) {
          setHidden(y > lastY && y > 480);
          lastY = y;
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // The section in the middle of the viewport lights up its link.
    const sections = headerNavItems
      .map((item) => document.getElementById(item.href.slice(1)))
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
    // Above the first tracked section nothing is active.
    const first = sections[0];
    const onTop = () => window.scrollY + window.innerHeight * 0.45 < first.offsetTop && setActive("");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  // One yellow block slides to the hovered link, or rests on the active one.
  const placeMarker = useCallback(() => {
    const list = listRef.current;
    const marker = markerRef.current;
    if (!list || !marker) return;
    const target = hovered ?? active;
    const link = target ? list.querySelector<HTMLAnchorElement>(`a[href="${target}"]`) : null;
    if (!link) {
      marker.style.opacity = "0";
      return;
    }
    marker.style.opacity = "1";
    marker.style.width = `${link.offsetWidth}px`;
    marker.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [hovered, active]);

  useEffect(() => {
    placeMarker();
    window.addEventListener("resize", placeMarker);
    return () => window.removeEventListener("resize", placeMarker);
  }, [placeMarker]);

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

  const highlighted = hovered ?? active;

  return (
    <header
      className={styles.header}
      data-scrolled={scrolled}
      data-hidden={hidden && !open}
    >
      <div className={`wrap ${styles.bar}`}>
        <a href="#inicio" className={styles.brand} aria-label="UP Fitness, voltar ao início">
          <Logo />
        </a>

        <OpenStatus className={styles.status} />

        <nav aria-label="Principal" className={styles.desktopNav}>
          <span ref={markerRef} className={styles.marker} aria-hidden="true" />
          <ul ref={listRef} onMouseLeave={() => setHovered(null)}>
            {headerNavItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  data-on={highlighted === item.href}
                  aria-current={active === item.href ? "location" : undefined}
                  onMouseEnter={() => setHovered(item.href)}
                  onFocus={() => setHovered(item.href)}
                  onBlur={() => setHovered(null)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a className={styles.join} href="#planos">
            Matricule-se <UpArrow />
          </a>
          <a className={styles.icon} href={whatsappUrl(visitMessage)} target="_blank" rel="noopener noreferrer">
            <SocialIcon kind="whatsapp" />
            <span className="visually-hidden">WhatsApp (abre em nova aba)</span>
          </a>
          <a className={styles.icon} href={contact.instagramUnit} target="_blank" rel="noopener noreferrer">
            <SocialIcon kind="instagram" />
            <span className="visually-hidden">Instagram (abre em nova aba)</span>
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={open ? "menu-mobile" : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.toggleLabel} aria-hidden="true">{open ? "Fechar" : "Menu"}</span>
          <span className="visually-hidden">{open ? "Fechar menu" : "Abrir menu"}</span>
          <span className={styles.burger} data-open={open} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <span className={styles.progress} aria-hidden="true" />

      <AnimatePresence>
        {open && (
          <m.nav
            id="menu-mobile"
            aria-label="Menu"
            className={styles.mobileNav}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="wrap">
              <ul className={styles.mobileList}>
                {headerNavItems.map((item, i) => (
                  <m.li
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.04, duration: 0.24 }}
                  >
                    <a href={item.href} aria-current={active === item.href ? "location" : undefined} onClick={() => setOpen(false)}>
                      {item.label}
                      <UpArrow />
                    </a>
                  </m.li>
                ))}
              </ul>
              <OpenStatus className={styles.mobileStatus} />
              <div className={styles.mobileActions}>
                <a className={styles.mobileJoin} href="#planos" onClick={() => setOpen(false)}>
                  Matricule-se <UpArrow />
                </a>
                <a
                  className={styles.mobileWa}
                  href={whatsappUrl(visitMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  <SocialIcon kind="whatsapp" /> WhatsApp
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              </div>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
