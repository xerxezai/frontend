import { Link } from "react-router-dom";
import type { TeamDataType } from "../../types";
import Image from "../utils/Image";

interface Props {
  teamInfo: TeamDataType;
}
const TeamDetailSection = ({ teamInfo }: Props) => {
  return (
    <section className="team-details-section-2 section-padding fix">
      <div className="container">
        <div className="team-details-wrapper">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="team-details-image">
                <Image
                  src={teamInfo.image}
                  alt="img"
                  width={636}
                  height={741}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="details-content">
                <span>{teamInfo.role}</span>
                <h2 className="char-animation">
                  {teamInfo.name}
                </h2>
                  <p>
                    A dedicated member of the XERXEZ team, bringing deep expertise
                    in enterprise AI, cloud infrastructure, and DevSecOps to help
                    clients modernise their technology stacks and accelerate growth.
                  </p>
                  <div className="progress-wrap">
                    <div className="pro-items">
                      <div className="pro-head">
                        <h6 className="title">Experience</h6>
                        <span className="point">80%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-value"></div>
                      </div>
                    </div>
                    <div className="pro-items">
                      <div className="pro-head">
                        <h6 className="title">Communication</h6>
                        <span className="point">90%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-value style-two"></div>
                      </div>
                    </div>
                  </div>
                  <ul className="contact-icon">
                    <li>
                      <div className="icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="content">
                        <span>Our Email</span>
                        <h3>
                          <a href="mailto:xerxez.in@gmail.com">
                            xerxez.in@gmail.com
                          </a>
                        </h3>
                      </div>
                    </li>
                    <li>
                      <div className="icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="content">
                        <span>Our Location</span>
                        <h3>India &amp; UAE — Remote-first, Global delivery</h3>
                      </div>
                    </li>
                    <li>
                      <div className="icon">
                        <i className="fas fa-phone-alt"></i>
                      </div>
                      <div className="content">
                        <span>Our Contact</span>
                        <h3>
                          <a href="mailto:xerxez.in@gmail.com">xerxez.in@gmail.com</a>
                        </h3>
                      </div>
                    </li>
                  </ul>
                  <div className="social-icon">
                    {teamInfo.socialLinks.map((team, i) => (
                      <Link to={team.url} key={i}>
                        <i className={team.iconClass}></i>
                      </Link>
                    ))}
                  </div>
              </div>
            </div>
          </div>
          <div className="team-about">
              <h3 className="char-animation">About Me</h3>
              <p className="mb-4">
                At XERXEZ, we believe the best enterprise technology is built by people who
                deeply understand both business challenges and modern engineering practices.
                Our team members bring years of hands-on experience delivering AI, cloud, and
                DevSecOps solutions across industries including finance, healthcare, logistics,
                and manufacturing.
              </p>
              <p>
                Every member of the XERXEZ team is committed to client success — from initial
                architecture design through to production deployment and ongoing support.
                We work as an extension of your team, sharing knowledge, transferring skills,
                and ensuring every solution we build is maintainable, secure, and aligned with
                your long-term business goals.
              </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamDetailSection;

