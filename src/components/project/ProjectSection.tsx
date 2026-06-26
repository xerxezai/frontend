import { Link } from "react-router-dom";
import { homeOneProjectData } from "../../data";
import React from "react";
import Image from "../utils/Image";

const ProjectSection: React.FC = () => {
  return (
    <section className="project-section-3 fix section-padding" style={{ background: "#EDE8DF" }}>
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our Case Study</span>
          <h2 className="char-animation">
            Real-World Enterprise <br /> Projects We've Delivered
          </h2>
        </div>

        <div className="project-wrapper">
          {homeOneProjectData.map((project, index) => (
            <div
              key={project.id}
              className="project-image-wrapper"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="800"
              data-aos-once="true"
            >
              <div className="project-image-items">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={436}
                  height={360}
                />
                <div className="content">
                  <span className="proj-category">{project.category}</span>
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
