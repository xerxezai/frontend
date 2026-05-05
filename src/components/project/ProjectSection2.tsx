import { Link } from "react-router-dom";
import { homeTwoProjectData } from "../../data";
import Image from "../utils/Image";

const ProjectSection2 = () => {
  return (
    <section className="project-secton-2 section-padding fix">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our Case Study</span>
          <h2 className="char-animation">
            View Our Handpicked Digital <br /> Marketing Case Study
          </h2>
        </div>

        <div className="row">
          {homeTwoProjectData.map((project, index) => (
            <div className="col-xl-6 col-lg-6 col-md-6" key={project.id}>
              <div
                className={`project-box-items-2 ${project.styleClass}`}
                data-aos="fade-up"
                data-aos-delay={index * 200} // stagger delay for each card
                data-aos-duration="1000" // smooth animation duration
                data-aos-easing="ease-out-cubic" // smooth easing
                data-aos-once="true"
              >
                <div className="project-img">
                  <Image
                    src={project.imgSrc}
                    alt="img"
                    width={project.width}
                    height={project.height}
                  />
                </div>
                <div className="project-content">
                  <p>{project.category}</p>
                  <h3>
                    <Link to={project.link}>{project.title}</Link>
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSection2;
