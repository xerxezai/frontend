import { testimonialData } from "../../data";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "../utils/Image";

const TestimonySection4 = () => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<i className="fas fa-star" key={i}></i>);
    }
    return stars;
  };
  return (
    <section className="testimonial-section-4 section-padding">
      <div className="bg-shape">
        <Image
          src="assets/img/testimonial/bg-shape.png"
          alt="img"
          width={1197}
          height={1034}
        />
      </div>
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our Testimonial</span>
          <h2 className="text-white char-animation">
            What Our Client Say
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
          {testimonialData.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-box-card-items">
                <div className="star">{renderStars(testimonial.stars)}</div>
                <h3>“{testimonial.quoteText}”</h3>
                <div className="client-info mt-5">
                  <div className="client-image">
                    <Image
                      src={testimonial.clientImageUrl}
                      alt={testimonial.clientName}
                      width={53}
                      height={53}
                    />
                  </div>
                  <div className="client-content mt-2">
                    <h3>{testimonial.clientName}</h3>
                    <p className="text-white">{testimonial.clientTitle}</p>
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

export default TestimonySection4;
