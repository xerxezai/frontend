import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AosInit = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    AOS.init({
      once: true,
      duration: prefersReduced ? 0 : 680,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      offset: 60,
      delay: 0,
      mirror: false,
      anchorPlacement: "top-bottom",
    });

    // Re-init on route change so dynamic content gets picked up
    const refresh = () => AOS.refresh();
    window.addEventListener("xz:route-change", refresh);
    return () => window.removeEventListener("xz:route-change", refresh);
  }, []);

  return null;
};

export default AosInit;

