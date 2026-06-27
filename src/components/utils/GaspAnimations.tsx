import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

const GsapAnimations = () => {
  const location = useLocation();
  useEffect(() => {
    if (typeof window === "undefined") return;

    const init = async () => {
      try {
        // Dynamically import GSAP & plugins (client-only)
        // const gsap = (await import("gsap")).default;
        // const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
        // const SplitType = (await import("split-type")).default;

        gsap.registerPlugin(ScrollTrigger);

        // --- TITLE SPLIT ANIMATIONS ---
        document
          .querySelectorAll<HTMLElement>(".char-animation")
          .forEach((element) => {
            const split = new SplitType(element, { types: "chars,words" });

            // Set initial state
            gsap.set(split.chars, { opacity: 0, x: 90 });

            // Animate when scrolled into view
            gsap.to(split.chars, {
              opacity: 1,
              x: 0,
              duration: 1,
              delay: 0.3,
              stagger: 0.05,
              ease: "power1.out",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                once: true,
              },
            });
          });

        // --- FADE-IN ANIMATIONS ---
        document
          .querySelectorAll<HTMLElement>(".fade-in")
          .forEach((element) => {
            gsap.set(element, { opacity: 0, y: 80 });
            gsap.to(element, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            });
          });

        // --- PARALLAX IMAGE SCALE (elements with .xz-parallax-img) ---
        document
          .querySelectorAll<HTMLElement>(".xz-parallax-img")
          .forEach((element) => {
            gsap.fromTo(element,
              { scale: 0.94, opacity: 0 },
              {
                scale: 1, opacity: 1,
                duration: 1.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 88%",
                  once: true,
                },
              }
            );
          });

        // --- SECTION HEADINGS fade up (h2, h3 inside .section-title) ---
        document
          .querySelectorAll<HTMLElement>(".section-title h2:not(.char-animation)")
          .forEach((element) => {
            gsap.fromTo(element,
              { opacity: 0, y: 28 },
              {
                opacity: 1, y: 0,
                duration: 0.85,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 88%",
                  once: true,
                },
              }
            );
          });

        // --- STAGGER GRID CARDS (children of .xz-stagger-grid) ---
        document
          .querySelectorAll<HTMLElement>(".xz-stagger-grid")
          .forEach((parent) => {
            const children = Array.from(parent.children) as HTMLElement[];
            gsap.fromTo(children,
              { opacity: 0, y: 32 },
              {
                opacity: 1, y: 0,
                duration: 0.65,
                ease: "power2.out",
                stagger: 0.08,
                scrollTrigger: {
                  trigger: parent,
                  start: "top 85%",
                  once: true,
                },
              }
            );
          });

      } catch (error) {
        console.error("GSAP animation error:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      init();
    }, 100);

    return () => {
      clearTimeout(timeoutId);

      // Cleanup GSAP scroll triggers
      import("gsap/ScrollTrigger").then(({ default: ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      });
    };
  }, [location.pathname]);

  return null;
};

export default GsapAnimations;

