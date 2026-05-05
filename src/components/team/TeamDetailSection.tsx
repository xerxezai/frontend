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
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Porttitor
                    a consequat hendrerit est, tortor finibus ridiculus cras.
                    Phasellus aliquet litora commodo aptent; potenti suspendisse
                    eu taciti condimentum.
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
                          <a href="mailto:helloseoz@gmial.com">
                            helloseoz@gmial.com
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
                        <h3>27 Division St, New York, NY 10002, USA</h3>
                      </div>
                    </li>
                    <li>
                      <div className="icon">
                        <i className="fas fa-phone-alt"></i>
                      </div>
                      <div className="content">
                        <span>Our Contact</span>
                        <h3>
                          <a href="tel:+1800123456789">+1 800 123 456 789</a>
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
                In today’s digital age, having a mobile-optimized website is no
                longer optional—it’s essential for the success of your business.
                With over half of global web traffic coming from mobile devices,
                consumers expect fast, seamless, and user-friendly experiences
                when browsing on their smartphones or tablets.
              </p>
              <p>
                A mobile-optimized website ensures that your site is responsive
                and adapts to any screen size, providing easy navigation, readable
                content, and fast loading times. This not only improves user
                experience but also boosts your site’s search engine rankings, as
                search engines like Google prioritize mobile-friendly websites in
                their results. Furthermore, a mobile-optimized site enhances brand
                credibility, builds customer trust, and increases the likelihood
                of conversions, as users are more likely to engage with a site
                that functions smoothly on their devices.
              </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamDetailSection;
