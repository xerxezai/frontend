import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const GsapAnimations = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || prefersReduced) return;

    const timeoutId = setTimeout(() => {
      try {
        // --- TITLE SPLIT ANIMATIONS ---
        document.querySelectorAll<HTMLElement>(".char-animation").forEach((el) => {
          const split = new SplitType(el, { types: "chars,words" });
          gsap.set(split.chars, { opacity: 0, x: 90 });
          gsap.to(split.chars, {
            opacity: 1, x: 0, duration: 1, delay: 0.3, stagger: 0.05,
            ease: "power1.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // --- FADE-IN ANIMATIONS ---
        document.querySelectorAll<HTMLElement>(".fade-in").forEach((el) => {
          gsap.set(el, { opacity: 0, y: 60 });
          gsap.to(el, {
            opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
          });
        });

        // --- PARALLAX IMAGE SCALE ---
        document.querySelectorAll<HTMLElement>(".xz-parallax-img").forEach((el) => {
          gsap.fromTo(el,
            { scale: 0.94, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.1, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true } }
          );
        });

        // --- SECTION HEADINGS (all pages) ---
        document.querySelectorAll<HTMLElement>(".section-title h2:not(.char-animation)").forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.75, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true } }
          );
        });

        // --- EYEBROWS (xz-eyebrow class) ---
        document.querySelectorAll<HTMLElement>(".xz-eyebrow").forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.55, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true } }
          );
        });

        // --- STAGGER GRID CARDS ---
        document.querySelectorAll<HTMLElement>(".xz-stagger-grid").forEach((parent) => {
          const children = Array.from(parent.children) as HTMLElement[];
          gsap.fromTo(children,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.09,
              scrollTrigger: { trigger: parent, start: "top 85%", once: true } }
          );
        });

        // --- STAT / COUNTER NUMBERS ---
        document.querySelectorAll<HTMLElement>(".xz-counter-card").forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, y: 20, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
              delay: i * 0.07 }
          );
        });

        // --- GENERIC xz-reveal ELEMENTS ---
        document.querySelectorAll<HTMLElement>(".xz-reveal").forEach((el, i) => {
          const dir = el.dataset.revealDir ?? "up";
          const from =
            dir === "left"  ? { opacity: 0, x: -32 } :
            dir === "right" ? { opacity: 0, x: 32 }  :
            dir === "scale" ? { opacity: 0, scale: 0.94 } :
                              { opacity: 0, y: 28 };
          gsap.fromTo(el, from,
            { opacity: 1, x: 0, y: 0, scale: 1,
              duration: 0.7, ease: "power2.out",
              delay: (el.dataset.revealDelay ? parseFloat(el.dataset.revealDelay) : i * 0.05),
              scrollTrigger: { trigger: el, start: "top 87%", once: true } }
          );
        });
      } catch {
        // Silent fail — animations are enhancement only
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [location.pathname]);

  return null;
};

export default GsapAnimations;
