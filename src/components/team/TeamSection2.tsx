import { Link } from "react-router-dom";
import { teamData } from "../../data";
import Image from "../utils/Image";

const TeamSection2 = () => {
  return (
    <section className="team-section-4 section-padding pt-0 pb-0">
      <div className="container">
        <div className="section-title-area text-center text-lg-start">
          <div className="section-title">
            <span className="fade-in">Our Team</span>
            <h2 className="text-white char-animation">
              Meet with Our Team Members
            </h2>
          </div>
          <p className="text-white">
            Read the latest SEO and marketing market news and the <br /> latest
            news about us. Sea ex everti labores.
          </p>
        </div>

        <div className="row">
          {teamData.slice(0, 4).map((member, index) => (
            <div className="col-xl-3 col-lg-4 col-md-6 col-6" key={member.id}>
              <div
                className="team-items-4"
                data-aos="fade-up"
                data-aos-delay={index * 200} // stagger delay for each card
                data-aos-duration="1000" // smooth animation duration
                data-aos-easing="ease-out-cubic" // smooth easing
                data-aos-once="true"
              >
                <div className="team-image">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={276}
                    height={276}
                  />
                </div>
                <div className="team-content">
                  <span>{member.role}</span>
                  <h3>
                    <Link to={`/team/${member.slug}`}>{member.name}</Link>
                  </h3>
                </div>
                <div className="social-icon">
                  {member.socialLinks.map((socialLink, sIndex) => (
                    <a href={socialLink.url} key={sIndex}>
                      <i className={socialLink.iconClass}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection2;
