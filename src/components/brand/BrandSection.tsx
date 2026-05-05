import { brandData } from "../../data";
import Image from "../utils/Image";
interface Props {
  variant?: string;
}
const BrandSection = ({ variant }: Props) => {
  return (
    <div
      className={`brand-section section-padding ${variant ? "" : "has-bg"} ${
        variant === "style-2"
          ? "pb-0"
          : variant === "style-3"
          ? "pt-0"
          : "fix pt-0"
      }`}
    >
      <div className="container">
        <div
          className={`section-title text-center ${
            variant === "style-2" ? "" : "mb-4"
          }`}
        >
          <p
            className={`${
              variant === "style-3" ? "text-color" : ""
            } char-animation`}
          >
            SEOZ is used by over <span>9K+</span> companies across the world
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {brandData.slice(0, 10).map((brand, index) => (
            <div
              key={brand.id}
              className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6"
              data-aos="fade-up"
              data-aos-delay={index * 200} // stagger delay for each card
              data-aos-duration="1000" // smooth animation duration
              data-aos-easing="ease-out-cubic" // smooth easing
              data-aos-once="true"
            >
              <div
                className={`brand-img ${
                  variant === "style-2" ? "style-2" : ""
                }`}
              >
                <Image
                  src={
                    variant === "style-2" ? brand.variantIconSrc : brand.iconSrc
                  }
                  alt="img"
                  width={brand.iconWidth}
                  height={brand.iconHeight}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSection;
