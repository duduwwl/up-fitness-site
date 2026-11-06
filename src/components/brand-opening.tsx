"use client";

import { useEffect, useRef } from "react";
import styles from "./brand-opening.module.css";

export function BrandOpening() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let show = false;
    try {
      show = document.documentElement.hasAttribute("data-up-opening");
      sessionStorage.setItem("up-fitness-opening", "1");
    } catch { return; }
    if (!show) return;
    element.hidden = false;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = () => { element.hidden = true; document.documentElement.removeAttribute("data-up-opening"); document.body.style.overflow = previous; };
    const timer = window.setTimeout(close, 1250);
    element.addEventListener("click", close);
    window.addEventListener("keydown", close);
    return () => {
      close();
      clearTimeout(timer);
      element.removeEventListener("click", close);
      window.removeEventListener("keydown", close);
    };
  }, []);
  return <><script dangerouslySetInnerHTML={{ __html: "try{if(!sessionStorage.getItem('up-fitness-opening')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-up-opening','')}catch(e){}" }} /><div ref={ref} id="brand-opening" className={styles.opening} aria-hidden="true">
    <div className={styles.word}>{"UP FITNESS".split("").map((letter, i) =>
      <span key={i} style={{ animationDelay: `${i * 40}ms` }}>{letter === " " ? "\u00a0" : letter}</span>)}</div>
    <p>ZONA SUL · LAVRAS</p>
  </div></>;
}
