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
          gsap.set(el, { opacity: 0, y: 80 });
          gsap.to(el, {
            opacity: 1, y: 0, duration: 1.2, ease: "power2.out",
            scrollTrigger: {
              trigger: el, start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        });

        // --- PARALLAX IMAGE SCALE ---
        document.querySelectorAll<HTMLElement>(".xz-parallax-img").forEach((el) => {
          gsap.fromTo(el,
            { scale: 0.94, opacity: 0 },
            {
              scale: 1, opacity: 1, duration: 1.1, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });

        // --- SECTION HEADINGS ---
        document
          .querySelectorAll<HTMLElement>(".section-title h2:not(.char-animation)")
          .forEach((el) => {
            gsap.fromTo(el,
              { opacity: 0, y: 28 },
              {
                opacity: 1, y: 0, duration: 0.85, ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }
            );
          });

        // --- STAGGER GRID CARDS ---
        document.querySelectorAll<HTMLElement>(".xz-stagger-grid").forEach((parent) => {
          const children = Array.from(parent.children) as HTMLElement[];
          gsap.fromTo(children,
            { opacity: 0, y: 32 },
            {
              opacity: 1, y: 0, duration: 0.65, ease: "power2.out", stagger: 0.08,
              scrollTrigger: { trigger: parent, start: "top 85%", once: true },
            }
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
