import { useEffect, useState } from "react";

const BackToTopBtn = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      setIsVisible(scroll >= 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <button
      type="button"
      className={`back-to-top ${isVisible ? "show" : ""}`}
      onClick={scrollToTop}
    >
      <i className="fas fa-long-arrow-up"></i>
    </button>
  );
};

export default BackToTopBtn;
