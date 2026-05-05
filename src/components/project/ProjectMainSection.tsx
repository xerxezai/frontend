import { Link } from "react-router-dom";
import { projectsData } from "../../data";
import React, { useState, useMemo } from "react";
import Image from "../utils/Image";

const ProjectMainSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(projectsData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = projectsData.slice(startIndex, endIndex);

    return { totalPages, currentItems };
  }, [currentPage, itemsPerPage]);

  const renderedProjects = useMemo(() => {
    return paginationData.currentItems.map((item, index) => (
      <div className="col-xl-4 col-lg-4 col-md-6" key={item.id}>
        <div
          className="project-box-items-2 mt-0"
          data-aos="fade-up"
          data-aos-delay={index * 200} // stagger delay for each card
          data-aos-duration="1000" // smooth animation duration
          data-aos-easing="ease-out-cubic" // smooth easing
          data-aos-once="true"
        >
          <div className="project-img style-2">
            <Image src={item.image} alt="img" width={416} height={330} />
            <Link to={`/project/${item.slug}`} className="post-cat">
              {item.category}
            </Link>
          </div>
          <div className="project-content">
            <h3>
              <Link to={`/project/${item.slug}`}>{item.title}</Link>
            </h3>
          </div>
        </div>
      </div>
    ));
  }, [paginationData.currentItems]);

  const renderedPagination = useMemo(() => {
    return Array.from({ length: paginationData.totalPages }, (_, index) => {
      const page = index + 1;
      return (
        <li key={page}>
          <a
            className={`page-numbers ${currentPage === page ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page);
            }}
          >
            {page.toString().padStart(2, "0")}
          </a>
        </li>
      );
    });
  }, [paginationData.totalPages, currentPage]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handlePrevPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = (): void => {
    if (currentPage < paginationData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className="project-section-5 fix section-padding">
      <div className="container">
        <div className="row g-4">{renderedProjects}</div>
        <div className="page-nav-wrap mt-5 text-center fade-in">
          <ul>
            <li>
              <a
                className={`page-numbers ${
                  currentPage === 1 ? "disabled-btn" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePrevPage();
                }}
              >
                <i className="fal fa-long-arrow-left"></i>
              </a>
            </li>
            {renderedPagination}
            <li>
              <a
                className={`page-numbers ${
                  currentPage === paginationData.totalPages
                    ? "disabled-btn"
                    : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNextPage();
                }}
              >
                <i className="fal fa-long-arrow-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProjectMainSection;
