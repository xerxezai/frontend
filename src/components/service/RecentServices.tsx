import { Link } from "react-router-dom";
import { useSafeServices } from "../../hooks/useSafeApi";
import { useState, useEffect } from "react";

const RecentServices = () => {
  const { data: apiServices, loading, error } = useSafeServices();
  const [services, setServices] = useState<any[]>([]);

  // Fallback to static data if API is not available
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const { services: staticServices } = await import("../../data");
        if (apiServices && apiServices.length > 0) {
          setServices(apiServices.slice(0, 5));
        } else {
          console.log('Using fallback static data for recent services');
          setServices(staticServices.slice(0, 5));
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
      <div className="sidebar-widget fade-in">
        <div className="sideber-title">
          <h4>Our Services</h4>
        </div>
        <ul>
          {[1, 2, 3, 4, 5].map((index) => (
            <li key={index} className="animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded flex-1 mr-2"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="sidebar-widget fade-in">
      <div className="sideber-title">
        <h4>Our Services</h4>
        {error && (
          <div className="text-xs text-yellow-600 mt-1">
            ⚠️ Using cached data
          </div>
        )}
      </div>
      <ul>
        {services.map((item, index) => (
          <li
            key={item.id}
            data-aos="fade-up"
            data-aos-delay={index * 200} // stagger delay for each card
            data-aos-duration="1000" // smooth animation duration
            data-aos-easing="ease-out-cubic" // smooth easing
            data-aos-once="true"
          >
            <Link to={`/service/${item.slug}`}>
              <span>{item.title} </span>
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
