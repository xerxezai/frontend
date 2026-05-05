import { Link } from "react-router-dom";
import { homeFourProjectData } from "../../data";
import Image from "../utils/Image";

interface Props {
  variant?: boolean;
}
const ProjectSection4 = ({ variant }: Props) => {
  return (
    <section
      className={`${
        variant ? "project-section-4 section-bg-2" : "project-section-41"
      } fix section-padding`}
    >
      {!variant && (
        <div className="left-shape">
          <Image
            src="assets/img/project/left-shape.png"
            alt="img"
            width={683}
            height={747}
          />
        </div>
      )}
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Baseline SEO Report</span>
          <h2 className={`char-animation ${variant ? "" : "text-white"}`}>
            View Our Handpicked Digital <br /> Marketing Case Study
          </h2>
        </div>
        <div className="project-wrapper-4 fade-in">
          <div className="row justify-content-center">
            {homeFourProjectData.map((project) => (
              <div className={project.colClass} key={project.id}>
                <div className={`project-box-5 ${project.itemStyleClass}`}>
                  <div className="content">
                    <h3>
                      <Link to={project.link}>{project.title}</Link>
                    </h3>
                    <p>{project.description}</p>
                    <Link to={project.link} className="link-btn">
                      More Details
                      <i className="far fa-arrow-right"></i>
                    </Link>
                  </div>
                  <div className="image">
                    <Image
                      src={project.imgSrc}
                      alt={project.title}
                      width={project.width}
                      height={project.height}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection4;
