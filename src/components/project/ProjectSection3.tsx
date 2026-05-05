import { Link } from "react-router-dom";
import { projectsData } from "../../data";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "../utils/Image";

const ProjectSection3 = () => {
  return (
    <section className="project-section-3 section-padding fix">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our Case Study</span>
          <h2 className="char-animation">
            View Our Handpicked Digital
            <br /> Marketing Case Study
          </h2>
        </div>
      </div>
      <div className="project-wrapper-3">
        <Swiper
          className="project-slider-3"
          spaceBetween={30}
          speed={2000}
          loop
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            1199: {
              slidesPerView: 4,
            },
            991: {
              slidesPerView: 3,
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
          {projectsData.map((project, index) => (
            <SwiperSlide key={project.id}>
              <div
                className={`project-items-3 ${
                  index % 2 === 0 ? "style-height" : ""
                }`}
              >
                <div
                  className={`project-image ${
                    index % 2 === 0 ? "style-height" : ""
                  }`}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={541}
                    height={519}
                  />
                </div>
                <div className="project-content">
                  <h6>{project.category}</h6>
                  <h3>
                    <Link to={`/project/${project.slug}`}>{project.title}</Link>
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProjectSection3;
