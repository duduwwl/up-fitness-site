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

// Capsule = brand disc + nav + collapsed CTA, plus the bar's own gaps and padding.
const CAPSULE_EXTRA = 40 + 48 + 2 * 20 + 2 * 8;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Leaving the hero turns the full-width bar into the floating capsule.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty("--scroll-progress", String(max > 0 ? Math.min(1, y / max) : 0));
        setScrolled(y > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // The capsule hugs its content: measure the nav once fonts are ready and on resize.
    const measure = () => {
      const header = headerRef.current;
      const nav = navRef.current;
      if (!header || !nav) return;
      header.style.setProperty("--capsule-w", `${nav.scrollWidth + CAPSULE_EXTRA}px`);
      // Room the CTA label needs when it unfolds inside the capsule.
      const label = header.querySelector<HTMLElement>(`.${styles.joinLabel} > span`);
      if (label) header.style.setProperty("--join-w", `${label.scrollWidth + 10}px`);
    };
    measure();
    void document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
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
    const first = sections[0];
    const onTop = () => window.scrollY + window.innerHeight * 0.45 < first.offsetTop && setActive("");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  // One yellow pill slides to the hovered link, or rests on the active one.
  const placeMarker = useCallback(() => {
    const nav = navRef.current;
    const marker = markerRef.current;
    if (!nav || !marker) return;
    const target = hovered ?? active;
    const link = target ? nav.querySelector<HTMLAnchorElement>(`a[href="${target}"]`) : null;
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
    <header ref={headerRef} className={styles.header} data-scrolled={scrolled} data-open={open}>
      <div className={styles.bar}>
        <a href="#inicio" className={styles.brand} aria-label="UP Fitness, voltar ao início">
          <Logo />
        </a>

        <nav ref={navRef} aria-label="Principal" className={styles.desktopNav} onMouseLeave={() => setHovered(null)}>
          <span ref={markerRef} className={styles.marker} aria-hidden="true" />
          <ul>
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
          <div className={styles.extras}>
            <OpenStatus className={styles.status} />
            <a className={styles.icon} href={whatsappUrl(visitMessage)} target="_blank" rel="noopener noreferrer">
              <SocialIcon kind="whatsapp" />
              <span className="visually-hidden">WhatsApp (abre em nova aba)</span>
            </a>
            <a className={styles.icon} href={contact.instagramUnit} target="_blank" rel="noopener noreferrer">
              <SocialIcon kind="instagram" />
              <span className="visually-hidden">Instagram (abre em nova aba)</span>
            </a>
          </div>
          <a className={styles.join} href="#planos">
            <span className={styles.joinLabel}>
              <span>Matricule-se</span>
            </span>
            <UpArrow />
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

        <span className={styles.progress} aria-hidden="true">
          <span />
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="menu-mobile"
            aria-label="Menu"
            className={styles.mobileNav}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className={styles.mobileList}>
              {headerNavItems.map((item, i) => (
                <m.li
                  key={item.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.045, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
