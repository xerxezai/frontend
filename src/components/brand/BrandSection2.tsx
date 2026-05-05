import { brandData } from "../../data";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "../utils/Image";
interface Props {
  variant?: boolean;
}
const BrandSection2 = ({ variant }: Props) => {
  return (
    <div
      className={`brand-section-2 section-padding fix ${variant ? "pt-0" : ""}`}
    >
      <div className="container">
        <Swiper
          className="brand-slide-2"
          spaceBetween={30}
          speed={2000}
          loop
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            1199: {
              slidesPerView: 7,
            },
            991: {
              slidesPerView: 6,
            },
            767: {
              slidesPerView: 5,
            },
            575: {
              slidesPerView: 4,
            },
            400: {
              slidesPerView: 3,
            },
          }}
          modules={[Autoplay]}
        >
          {brandData.map((brand) => (
            <SwiperSlide key={brand.id}>
              <div className="brand-image text-center">
                <Image
                  src={brand.imgSrc}
                  alt={brand.alt}
                  width={brand.width}
                  height={brand.height}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BrandSection2;
