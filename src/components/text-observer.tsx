"use client";

import { useEffect } from "react";

export function TextObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("text-entered");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    document.querySelectorAll(".text-words").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => footer.style.setProperty("--footer-position",
      !reduced.matches && footer.offsetHeight <= window.innerHeight ? "sticky" : "static");
    const resize = new ResizeObserver(update);
    resize.observe(footer);
    window.addEventListener("resize", update);
    reduced.addEventListener("change", update);
    update();
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", update);
      reduced.removeEventListener("change", update);
      footer.style.removeProperty("--footer-position");
    };
  }, []);
  return null;
}
