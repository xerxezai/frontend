import { useEffect, useRef, useState } from "react";
import { counterData } from "../../data";
import CountUp from "../utils/CountUp";

const BAR_TARGETS = [82, 85, 70, 98];

interface Props {
  variant?: string;
}

const AnimatedBar = ({ target, delay }: { target: number; delay: number }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(target), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, delay]);

  return (
    <div ref={ref} style={{
      marginTop: 10,
      height: 4,
      borderRadius: 4,
      background: "rgba(108,87,210,0.15)",
      overflow: "hidden",
    }}>
      <div style={{
        height: "100%",
        borderRadius: 4,
        background: "linear-gradient(90deg, #6c57d2, #8b73ff)",
        width: `${width}%`,
        transition: "width 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
      }} />
    </div>
  );
};

const CounterSection = ({ variant }: Props) => {
  const showBars = variant === "style-3";

  if (showBars) {
    return (
      <section className="fix section-padding" style={{ background: "#F5F5F7" }}>
        <div className="container">
          <div className="section-title text-center mb-50">
            <span className="fade-in">By the Numbers</span>
            <h2 className="char-animation">Proven at Enterprise Scale</h2>
          </div>
          <div className="row g-4">
            {counterData.map((item, i) => (
              <div
                key={item.id}
                className="col-6 col-lg-3"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div style={{
                  background: "#fff",
                  border: "1px solid #E5E5E5",
                  borderRadius: 16,
                  padding: "28px 24px",
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: "#F0EEFF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 14,
                  }}>
                    <i className={item.iconClass} style={{ color: "#6c57d2", fontSize: 20 }} />
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#6c57d2", lineHeight: 1 }}>
                    <CountUp value={item.variantTargetValue} suffix={item.variantSuffix} />
                  </div>
                  <div style={{ fontSize: 13, color: "#4B4B4B", marginTop: 6, fontWeight: 500 }}>
                    {item.variantLabel}
                  </div>
                  <AnimatedBar target={BAR_TARGETS[i] ?? 80} delay={i * 150} />
                  <div style={{
                    fontSize: 10, color: "#9E9E9E", marginTop: 5,
                    textAlign: "right", fontWeight: 600, letterSpacing: "0.05em",
                  }}>
                    {BAR_TARGETS[i] ?? 80}% milestone
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`counter-section fix section-padding pt-0 ${
        variant === "style-2" ? "sec-bg-4" : ""
      }`}
    >
      <div className="container">
        <div className="counter-wrapper">
          {counterData.map((item, index) => (
            <div
              key={item.id}
              className={`counter-items ${item.styleClass}`}
              data-aos="fade-up"
              data-aos-delay={index * 200}
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <div className="icon">
                <i className={item.iconClass}></i>
              </div>
              <div className="content">
                <CountUp value={item.targetValue} suffix={item.suffix} />
                <p className={variant === "style-2" ? "text-white" : ""}>
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
