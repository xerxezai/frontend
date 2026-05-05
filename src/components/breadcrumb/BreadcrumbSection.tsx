import { Link } from "react-router-dom";
interface Props {
  title: string;
}
const BreadcrumbSection = ({ title }: Props) => {
  return (
    <section className="breadcrumb-section fix bg-cover">
      <div className="container">
        <div className="row">
          <div className="page-heading">
              <ul className="breadcrumb-list fade-in">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <i className="fal fa-long-arrow-right"></i>
                </li>
                <li>{title}</li>
              </ul>
              <h2 className="char-animation">{title}</h2>
          </div>
        </div>
      </div>
    </section >
  );
};

export default BreadcrumbSection;
