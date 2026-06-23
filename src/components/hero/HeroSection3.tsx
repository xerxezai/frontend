import { useCustomContext } from "../../context/context";
import SeoFormSection from "../forms/SeoFormSection";

const HeroSection3 = () => {
  const { toggleVideoModal } = useCustomContext();
  return (
    <section className="hero-section hero-3">
      <div className="left-shape float-bob-x">
        <img
          src="/assets/img/hero/left-shape-2.png"
          alt="img"
          width={401}
          height={255}
        />
      </div>
      <div className="right-shape float-bob-y">
        <img
          src="/assets/img/hero/right-shape.png"
          alt="img"
          width={386}
          height={390}
        />
      </div>
      <div className="plane-shape float-bob-x">
        <img
          src="/assets/img/hero/plane-3.png"
          alt="img"
          width={126}
          height={117}
        />
      </div>
      <div className="plane-shape-2 float-bob-y">
        <img
          src="/assets/img/hero/plane-shape-3.png"
          alt="img"
          width={266}
          height={121}
        />
      </div>
      <button
        className="video-btn ripple video-popup"
        onClick={toggleVideoModal}
      >
        <i className="fas fa-play"></i>
      </button>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-9">
            <div className="hero-content">
              <span>Welcome to XERXEZ</span>
              <h1 className="char-animation whitespace-pre-line">
                AI, Cloud &amp; DevSecOps <br /> Solutions for Enterprises
              </h1>
              <p>
                Over 10 years delivering intelligent enterprise systems — ERP, MLOps pipelines,
                cloud infrastructure, and secure software at scale.
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
