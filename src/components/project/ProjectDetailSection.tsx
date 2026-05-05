import type { ProjectDataType } from "../../types";
import ProjectDetailSidebar from "./ProjectDetailSidebar";
import { projectsData } from "../../data";
import { useNavigate } from "react-router-dom";
import Image from "../utils/Image";

interface Props {
  projectInfo: ProjectDataType;
  currentIndex: number;
}
const ProjectDetailSection = ({ projectInfo, currentIndex }: Props) => {
  const router = useNavigate();
  const prevItem =
    projectsData[
      (currentIndex - 1 + projectsData.length) % projectsData.length
    ];
  const nextItem = projectsData[(currentIndex + 1) % projectsData.length];
  return (
    <section className="project-details-section section-padding fix">
      <div className="container">
        <div className="project-details-wrapper">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="project-details-content">
                <div className="project-details-image">
                  <Image
                    src={projectInfo.detailImg}
                    alt="img"
                    width={856}
                    height={406}
                  />
                </div>
                <h2 className="char-animation">{projectInfo.title}</h2>
                <p className="mt-2">
                  Mauris ut enim sit amet lacus ornare ullamcorper. Praesent
                  placerat neque eu purus rhoncus, vel tincidunt odio ultrices.
                  Sed theya are tincidunt feugiat elis Curabitur posuere
                  tristique.
                </p>
                <p className="mt-3">
                  Transportation Information Modeling (BIM) is revolutionizing
                  how construction projects are designed, managed, and executed.
                  BIM allows for the creation of detailed digital building
                  construction marketing representations of buildings,
                  facilitating better planning, collaboration, and
                  decision-making.
                </p>
                <div className="row">
                  <div className="col-lg-6">
                    <div className=" project-details-image-2">
                      <Image
                        src="assets/img/project/project-details-02.jpg"
                        alt="img"
                        width={406}
                        height={258}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="project-details-image-2">
                      <Image
                        src="assets/img/project/project-details-03.jpg"
                        alt="img"
                        width={406}
                        height={258}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="char-animation">Strategy Consulting</h3>
                <p className="mt-2">
                  Sed theya are tincidunt feugiat elis Curabitur posuere
                  tristique. Mauris ut enim sit amet lacus ornare ullamcorper.
                  Praesent placerat neque eu purus rhoncus, vel tincidunt odio
                  ultrices. Sed theya are tincidunt feugiat elis Curabitur
                  posuere tristique.
                </p>
                <div className="icon-box-items">
                  <div className="icon-box">
                    <i className="flaticon-check"></i>
                    <p>SEO Audit & Analysis</p>
                  </div>
                  <div className="icon-box">
                    <i className="flaticon-check"></i>
                    <p>SEO Audit & Analysis</p>
                  </div>
                  <div className="icon-box">
                    <i className="flaticon-check"></i>
                    <p>SEO Audit & Analysis</p>
                  </div>
                </div>
                <p className="mt-4">
                  Sed theya are tincidunt feugiat elis Curabitur posuere
                  tristique. Mauris ut enim sit amet lacus ornare ullamcorper.
                  Praesent placerat neque eu purus rhoncus, vel tincidunt odio
                  ultrices. Sed theya are tincidunt feugiat elis Curabitur
                  posuere tristique.
                </p>
              </div>
              <div className="slider-button d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-xxl-4 gap-3 gap-2">
                  <button
                    className="cmn-prev cmn-border d-center"
                    onClick={() => router(`/project/${prevItem?.slug}`)}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <span className="previus-text text-capitalize">previous</span>
                </div>
                <div className="d-flex align-items-center gap-xxl-4 gap-3 gap-2">
                  <span className="previus-text text-capitalize">Next</span>
                  <button
                    className="cmn-next cmn-border d-center"
                    onClick={() => router(`/project/${nextItem?.slug}`)}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <ProjectDetailSidebar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailSection;
