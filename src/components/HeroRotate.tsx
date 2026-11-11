"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "loja sem estoque",
  "vitrine com Xnamai",
  "domínio próprio",
  "site + marketplaces",
] as const;

export function HeroRotate() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 280);
    }, 2800);

    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={`hero-rotate ${visible ? "is-on" : "is-off"}`} aria-live="polite">
      {PHRASES[index]}
    </span>
  );
}
