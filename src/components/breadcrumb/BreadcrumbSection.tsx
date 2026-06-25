import { Link } from "react-router-dom";

interface Props {
  title: string;
}

const BreadcrumbSection = ({ title }: Props) => (
  <section className="breadcrumb-section fix bg-cover">
    <div className="container">
      <ul className="breadcrumb-list fade-in">
        <li><Link to="/">Home</Link></li>
        <li aria-hidden="true">›</li>
        <li>{title}</li>
      </ul>
    </div>
  </section>
);

export default BreadcrumbSection;
