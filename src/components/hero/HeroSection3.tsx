import { useCustomContext } from "../../context/context";
import SeoFormSection from "../forms/SeoFormSection";
import Image from "../utils/Image";

const HeroSection3 = () => {
  const { toggleVideoModal } = useCustomContext();
  return (
    <section className="hero-section hero-3">
      <div className="left-shape float-bob-x">
        <Image
          src="assets/img/hero/left-shape-2.png"
          alt="img"
          width={401}
          height={255}
        />
      </div>
      <div className="right-shape float-bob-y">
        <Image
          src="assets/img/hero/right-shape.png"
          alt="img"
          width={386}
          height={390}
        />
      </div>
      <div className="plane-shape float-bob-x">
        <Image
          src="assets/img/hero/plane-3.png"
          alt="img"
          width={126}
          height={117}
        />
      </div>
      <div className="plane-shape-2 float-bob-y">
        <Image
          src="assets/img/hero/plane-shape-3.png"
          alt="img"
          width={266}
          height={121}
        />
      </div>
      <a
        className="video-btn ripple video-popup"
        role="button"
        onClick={toggleVideoModal}
      >
        <i className="fas fa-play"></i>
      </a>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-9">
            <div className="hero-content">
              <span>Welcome to</span>
              <h1 className="char-animation whitespace-pre-line">
                Top SEO and Digital <br /> Marketing Agency
              </h1>
              <p>
                Over 10 years SEOZ helping companies reach their financial and
                branding goals for your company.
              </p>
              <SeoFormSection variant />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection3;
