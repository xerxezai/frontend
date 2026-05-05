import { Link } from "react-router-dom";
import { useSafeServices } from "../../hooks/useSafeApi";
import { useState, useEffect } from "react";

const ServiceSection = () => {
  const { data: apiServices, loading, error } = useSafeServices();
  const [services, setServices] = useState<any[]>([]);

  // Fallback to static data if API is not available
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const { services: staticServices } = await import("../../data");
        if (apiServices && apiServices.length > 0) {
          setServices(apiServices.slice(0, 4));
        } else {
          console.log('Using fallback static data for services');
          setServices(staticServices.slice(0, 4));
        }
      } catch (importError) {
        console.error('Failed to load static data:', importError);
        setServices([]);
      }
    };

    loadStaticData();
  }, [apiServices]);

  if (loading) {
    return (
      <section className="service-section fix section-padding">
        <div className="container">
          <div className="section-title text-center">
            <span className="fade-in">Welcome to SEOZ</span>
            <h2 className="char-animation">
              Generating New <br />
              Customers Via Online Mode
            </h2>
            <p className="mt-3">
              Loading our services...
            </p>
          </div>
          <div className="row">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                <div className="service-card-items-1 animate-pulse">
                  <div className="service-icon color-1">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="service-content">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Service API Error:', error);
  }

  return (
    <section className="service-section fix section-padding">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Welcome to SEOZ</span>
          <h2 className="char-animation">
            Generating New <br />
            Customers Via Online Mode
          </h2>
          <p className="mt-3">
            Welcome to SEOZ your trusted partner for comprehensive SEO and
            digital marketing solutions. With <br /> our proven expertise and
            innovative strategies the digital landscape.
          </p>
          {error && (
            <div className="mt-2 text-sm text-yellow-600">
              ⚠️ Using cached data - API unavailable
            </div>
          )}
        </div>

        <div className="row">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="col-xl-3 col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={index * 200} // stagger delay for each card
              data-aos-duration="1000" // smooth animation duration
              data-aos-easing="ease-out-cubic" // smooth easing
              data-aos-once="true"
            >
              <div
                className={`service-card-items-1 ${
                  index % 2 === 0 ? "item_right_1" : "item_left_1"
                }`}
              >
                <div className={`service-icon color-${index + 1}`}>
                  <i className={service.iconClass || service.icon_class}></i>
                </div>
                <div className="service-content">
                  <h3>
                    <Link to={`/service/${service.slug}`}>{service.title}</Link>
                  </h3>
                  <p>{(service.description || service.excerpt)?.slice(0, 70)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
