import { Link } from "react-router-dom";
import { homeOneProjectData } from "../../data";
import React, { useState } from "react";
import Image from "../utils/Image";

const ProjectSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(homeOneProjectData.length - 1);
  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="project-section-3 fix section-padding">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our Case Study</span>
          <h2 className="char-animation">
            View Our Handpicked Digital <br /> Marketing Case Study
          </h2>
        </div>

        <div className="project-wrapper project-slide-animation-1">
          {homeOneProjectData.map((project, index) => (
            <div
              key={project.id}
              className="project-image-wrapper"
              data-aos="fade-up"
              data-aos-delay={index * 200}
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <div
                className={`project-image-items ${
                  index === activeIndex ? "active" : ""
                }`}
                onMouseEnter={() => handleMouseEnter(index)}
              >
                <Image
                  src={project.imageUrl}
                  alt="img"
                  width={436}
                  height={550}
                />

                <div className="content">
                  <h4>
                    <Link to={project.link}>{project.title}</Link>
                  </h4>
                  <p>{project.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
