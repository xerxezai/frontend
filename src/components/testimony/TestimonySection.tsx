import { testimonialData } from "../../data";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "../utils/Image";

const TestimonySection = () => (
  <section className="fix section-padding" style={{ background: "#F5F5F7" }}>
    <div className="container">
      <div className="section-title text-center">
        <span className="fade-in">Client Stories</span>
        <h2 className="char-animation">What Enterprises Say About Us</h2>
        <p style={{ color: "#4B4B4B", maxWidth: 520, margin: "0 auto" }}>
          Trusted by IT directors, CTOs, and digital transformation leads across
          healthcare, logistics, finance, and retail.
        </p>
      </div>

      <Swiper
        spaceBetween={24}
        speed={600}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          1199: { slidesPerView: 3 },
          768:  { slidesPerView: 2 },
          0:    { slidesPerView: 1 },
        }}
        modules={[Autoplay, Navigation, Pagination]}
        style={{ paddingBottom: 48 }}
      >
        {testimonialData.map((item) => (
          <SwiperSlide key={item.id}>
            <div style={{
              background: "#fff",
              border: "1px solid #E5E5E5",
              borderRadius: 16,
              padding: "28px 24px",
              height: "100%",
              display: "flex", flexDirection: "column",
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}>
              {/* Opening quote decoration */}
              <div style={{
                fontSize: 56, lineHeight: 1, color: "rgba(108,87,210,0.15)",
                fontFamily: "Georgia, serif", marginBottom: 4,
              }}>
                "
              </div>

              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {[...Array(item.stars)].map((_, i) => (
                  <i key={i} className="fas fa-star" style={{ color: "#f8bc26", fontSize: 13 }} />
                ))}
              </div>

              {/* Quote text */}
              <p style={{
                color: "#4B4B4B", fontSize: 14, lineHeight: 1.7,
                flex: 1, margin: 0,
              }}>
                {item.quoteText}
              </p>

              {/* Client info */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                marginTop: 20, paddingTop: 20,
                borderTop: "1px solid #E5E5E5",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  overflow: "hidden", flexShrink: 0,
                  border: "2px solid rgba(108,87,210,0.20)",
                }}>
                  <Image src={item.clientImageUrl} alt={item.clientName} width={48} height={48} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0A0A0A" }}>
                    {item.clientName}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 2 }}>
                    {item.clientTitle}
                  </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <i className="fas fa-quote-right" style={{ color: "rgba(108,87,210,0.20)", fontSize: 20 }} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default TestimonySection;
