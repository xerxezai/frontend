import { testimonialData } from "../../data";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "../utils/Image";

const TestimonySection2 = () => {
  return (
    <section className="testimonial-section-2 section-padding bg-cover pt-0">
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-8">
            <div className="testimonial-box-items-2">
              <div className="section-title text-start mb-0">
                <span className="fade-in">Our Testimonial</span>
                <h2 className="text-white char-animation">
                  What Client Say About Us
                </h2>
              </div>
              <Swiper
                className="testimonial-slider-4"
                spaceBetween={30}
                speed={2000}
                loop
                autoplay={{
                  delay: 1000,
                  disableOnInteraction: false,
                }}
                navigation={{
                  nextEl: ".array-prev",
                  prevEl: ".array-next",
                }}
                pagination={{
                  el: ".dot",
                  clickable: true,
                }}
                modules={[Autoplay, Navigation, Pagination]}
              >
                {testimonialData.slice(0, 3).map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="star">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <i className="fas fa-star" key={i}></i>
                      ))}
                    </div>
                    <h4 className="text-white">“{testimonial.quoteText}”</h4>
                    <div className="client-info">
                      <div className="client-image">
                        <Image
                          src={testimonial.clientImageUrl}
                          alt="Client"
                          width={53}
                          height={53}
                        />
                      </div>
                      <div className="client-content">
                        <h3 className="text-white">{testimonial.clientName}</h3>
                        <p className="text-white">{testimonial.clientTitle}</p>
                      </div>
                    </div>
                    <div className="google-logo">
                      <Image
                        src={testimonial.quoteImageUrl}
                        alt="Google Logo"
                        width={74}
                        height={26}
                      />
                    </div>
                  </SwiperSlide>
                ))}
                <div className="swiper-dot3 mt-5">
                  <div className="dot"></div>
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonySection2;
