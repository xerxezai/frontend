import { Link } from "react-router-dom";
import { services } from "../../data";

const RecentServices = () => {
  return (
    <div className="sidebar-widget fade-in">
      <div className="sideber-title">
        <h4>Our Services</h4>
      </div>
      <ul>
        {services.map((item, index) => (
          <li
            key={item.id}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            data-aos-duration="800"
            data-aos-easing="ease-out-cubic"
            data-aos-once="true"
          >
            <Link to={`/service/${item.slug}`}>
              <span>{item.title.replace("\n", " ")}</span>
              <span className="icon">
                <i className="far fa-long-arrow-right"></i>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentServices;
