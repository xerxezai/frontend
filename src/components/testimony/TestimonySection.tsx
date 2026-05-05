import { testimonialData } from "../../data";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "../utils/Image";

const TestimonySection = () => {
  return (
    <section className="testimonial-section fix section-padding">
      <div className="container">
        <div className="section-title">
          <span className="fade-in">Our Testimonial</span>
          <h2 className="char-animation">
            What Client Say About Us
          </h2>
        </div>
        <Swiper
          className="testimonial-slider-3"
          spaceBetween={30}
          speed={2000}
          loop
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            1199: {
              slidesPerView: 3,
            },
            991: {
              slidesPerView: 2,
            },
            767: {
              slidesPerView: 2,
            },
            575: {
              slidesPerView: 1,
            },
            400: {
              slidesPerView: 1,
            },
          }}
          modules={[Autoplay]}
        >
          {testimonialData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="testimonial-box-items">
                <div className="testimonial-box">
                  <div className="star-box-items">
                    <div className="star">
                      {[...Array(item.stars)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                    <Image
                      src={item.quoteImageUrl}
                      alt="img"
                      width={74}
                      height={30}
                    />
                  </div>
                  <p>{item.quoteText}</p>
                </div>
                <div className="client-info">
                  <div className="client-img">
                    <Image
                      src={item.clientImageUrl}
                      alt="img"
                      width={53}
                      height={53}
                    />
                  </div>
                  <div className="client-content">
                    <h3>{item.clientName}</h3>
                    <p>{item.clientTitle}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonySection;
