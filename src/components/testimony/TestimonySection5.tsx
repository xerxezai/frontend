import { testimonialData } from "../../data";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "../utils/Image";

const TestimonySection5 = () => {
  return (
    <section className="testimonial-section-5 section-padding fix">
      <div className="testimonial-shape-1">
        <Image
          src="assets/img/testimonial/shape-01.png"
          alt="img"
          width={191}
          height={191}
        />
      </div>
      <div className="testimonial-shape-2">
        <Image
          src="assets/img/testimonial/shape-02.png"
          alt="img"
          width={191}
          height={191}
        />
      </div>
      <div className="testimonial-shape-3">
        <Image
          src="assets/img/testimonial/shape-03.png"
          alt="img"
          width={212}
          height={212}
        />
      </div>
      <div className="testimonial-shape-4">
        <Image
          src="assets/img/testimonial/shape-04.png"
          alt="img"
          width={248}
          height={248}
        />
      </div>
      <div className="container">
        <div className="array-button">
          <button className="array-prev">
            <i className="far fa-arrow-left"></i>
          </button>
          <button className="array-next">
            <i className="far fa-arrow-right"></i>
          </button>
        </div>
        <div className="section-title-area text-center text-lg-start">
          <div className="section-title">
            <span className="fade-in">Our Testimonial</span>
            <h2 className="char-animation">
              Read What They Have to Say <br /> About Working with Us
            </h2>
          </div>
          <p>
            Walleye poolfish sand goby butterfly ray stream catfish jewfish
            spanish.
            <br /> Stream catfish jewfish spanish ballan wrasse climbing gourami
            amur pike <br /> arctic char steelhead sprat sea lamprey grunion.
          </p>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-10">
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
              modules={[Autoplay, Navigation]}
            >
              {testimonialData.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="testimonial-box-5">
                    <div className="testimonial-icon">
                      <Image
                        src={testimonial.variantClientImageUrl}
                        alt={testimonial.clientName}
                        width={124}
                        height={124}
                      />
                    </div>
                    <div className="testimonial-content">
                      <h4>“{testimonial.quoteText}”</h4>
                      <div className="clinet-info">
                        <h3>{testimonial.clientName}</h3>
                        <p>{testimonial.clientTitle}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonySection5;
