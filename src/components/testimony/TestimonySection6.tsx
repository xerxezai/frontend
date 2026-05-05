import { testimonialData } from "../../data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "../utils/Image";

const TestimonySection6 = () => {
  return (
    <section className="testimonial-section-6 section-bg-2 section-padding fix">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title">
            <span className="fade-in">Our Testimonial</span>
            <h2 className="char-animation">
              Read What They Have to Say <br /> About Working with Us
            </h2>
          </div>
          <p className="fade-in">
            Walleye poolfish sand goby butterfly ray stream catfish jewfish
            spanish.
            <br />
            Stream catfish jewfish spanish ballan wrasse climbing gourami amur
            pike
            <br />
            arctic char steelhead sprat sea lamprey grunion.
          </p>
        </div>

        <div className="testimonial-wrapper-6">
          <div className="row g-4 align-items-center">
            <div className="col-lg-4">
              <div className="testimonial-left-items">
                <div className="testimonial-content">
                  <h2>4.9</h2>
                  <div className="star">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <h5>88 Reviews</h5>
                  <h4>Customer experiences that speak for themselves</h4>
                </div>
                <div className="client-info">
                  <div className="client-img">
                    <Image
                      src="assets/img/testimonial/testimonial-6-01.png"
                      alt="img"
                      width={329}
                      height={57}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <Swiper
                spaceBetween={30}
                speed={2000}
                loop
                autoplay={{
                  delay: 1000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  el: ".swiper-dot3",
                  clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="testimonial-slider-4"
              >
                {testimonialData.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="testimonial-box-6">
                      <div className="star-box-items d-flex align-items-center justify-content-between">
                        <div className="star">
                          {Array.from({ length: item.stars }).map((_, i) => (
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
                      <div className="client-info d-flex align-items-center mt-4">
                        <div className="client-img me-3">
                          <Image
                            src={item.clientImageUrl}
                            alt="img"
                            width={53}
                            height={53}
                          />
                        </div>
                        <div className="client-content">
                          <h3>{item.clientName}</h3>
                          <span>{item.clientTitle}</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-dot3 mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonySection6;
