import { Link } from "react-router-dom";
import { teamData } from "../../data";
import { useState, useMemo } from "react";
import Image from "../utils/Image";

const TeamMainSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(teamData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMembers = teamData.slice(startIndex, endIndex);

    return { totalPages, currentMembers };
  }, [currentPage, itemsPerPage]);

  const renderedTeamMembers = useMemo(() => {
    return paginationData.currentMembers.map((member, index) => (
      <div key={member.id} className="col-xl-4 col-lg-6 col-md-6">
        <div
          className="team-items-2 mt-0"
          data-aos="fade-up"
          data-aos-delay={index * 200} // stagger delay for each card
          data-aos-duration="1000" // smooth animation duration
          data-aos-easing="ease-out-cubic" // smooth easing
          data-aos-once="true"
        >
          <div className="team-image">
            <Image src={member.image} alt="img" width={416} height={485} />
            <div className="social-links">
              {member.socialLinks.map((social, i) => (
                <Link to={social.url} key={i}>
                  <i className={social.iconClass}></i>
                </Link>
              ))}
            </div>
            <span className="share-icon fa fa-share-alt"></span>
          </div>
          <div className="team-content">
            <p>{member.role}</p>
            <h3>
              <Link to={`/team/${member.slug}`}>{member.name}</Link>
            </h3>
          </div>
        </div>
      </div>
    ));
  }, [paginationData.currentMembers]);

  const renderedPagination = useMemo(() => {
    return Array.from({ length: paginationData.totalPages }, (_, index) => {
      const pageNum = index + 1;
      return (
        <li key={pageNum}>
          <a
            className={`page-numbers ${
              currentPage === pageNum ? "active" : ""
            }`}
            role="button"
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum.toString().padStart(2, "0")}
          </a>
        </li>
      );
    });
  }, [paginationData.totalPages, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="team-section-2 section-padding fix">
      <div className="container">
        <div className="row g-4">{renderedTeamMembers}</div>
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
                  handlePageChange(currentPage - 1);
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
                onClick={() => handlePageChange(currentPage + 1)}
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

export default TeamMainSection;
