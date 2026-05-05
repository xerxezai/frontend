import { Link } from "react-router-dom";
import { teamData } from "../../data";
import Image from "../utils/Image";

const TeamSection = () => {
  return (
    <section className="team-section-2 section-padding fix pt-0">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our Team</span>
          <h2 className="char-animation">Meet with Our Team Members</h2>
        </div>

        <div className="row">
          {teamData.slice(0, 3).map((member, index) => (
            <div className="col-xl-4 col-lg-6 col-md-6" key={member.id}>
              <div
                className="team-items-2"
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
                    width={416}
                    height={485}
                  />
                  <div className="social-links">
                    {member.socialLinks.map((social, i) => (
                      <a href={social.url} key={i}>
                        <i className={social.iconClass}></i>
                      </a>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
