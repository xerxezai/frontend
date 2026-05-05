import { testimonialData } from "../../data";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "../utils/Image";

const TestimonySection3 = () => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<i className="fas fa-star" key={i}></i>);
    }
    return stars;
  };
  return (
    <section className="testimonial-section-3 section-padding fix section-bg">
      <div className="container">
        <div className="section-title-area text-center text-lg-start">
          <div className="section-title">
            <span className="fade-in">Our Testimonial</span>
            <h2 className="char-animation">
              What Do Our
              <br /> Customers Say Us?
            </h2>
          </div>
          <p>
            Welcome to SEOZ your trusted partner for comprehensive SEO and
            <br /> digital marketing solutions with our proven expertise
          </p>
        </div>
        <Swiper
          className="testimonial-slider-1"
          spaceBetween={30}
          speed={2000}
          loop
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          breakpoints={{
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
          {testimonialData.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-box-items style-2">
                <div className="client-info">
                  <div className="client-img">
                    <Image
                      src={testimonial.clientImageUrl}
                      alt={testimonial.clientName}
                      width={53}
                      height={53}
                    />
                  </div>
                  <div className="client-content">
                    <h3>{testimonial.clientName}</h3>
                    <p>{testimonial.clientTitle}</p>
                  </div>
                </div>
                <div className="testimonial-box">
                  <div className="star-box-items">
                    <div className="star">{renderStars(testimonial.stars)}</div>
                    <Image
                      src={testimonial.quoteImageUrl}
                      alt="rating graphic"
                      width={74}
                      height={30}
                    />
                  </div>
                  <p>“{testimonial.quoteText}”</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonySection3;
