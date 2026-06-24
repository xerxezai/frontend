import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";

const categories = [
  { icon: "fas fa-brain", name: "AI & Machine Learning", courses: 8 },
  { icon: "fas fa-shield-alt", name: "DevSecOps & CI/CD", courses: 6 },
  { icon: "fas fa-cloud", name: "Cloud Computing (AWS/Azure/GCP)", courses: 7 },
  { icon: "fas fa-cogs", name: "ERP Systems & Implementation", courses: 5 },
  { icon: "fas fa-atom", name: "Quantum Computing", courses: 4 },
  { icon: "fas fa-lock", name: "Cybersecurity & Compliance", courses: 6 },
];

const courses = [
  {
    icon: "fas fa-cogs",
    title: "AI-Powered ERP Implementation",
    category: "ERP Systems",
    level: "Intermediate",
    levelColor: "#ff792e",
    duration: "40 Hours",
    lessons: "32 Lessons",
    badge: "Bestseller",
    badgeBg: "#ff792e",
  },
  {
    icon: "fas fa-shield-alt",
    title: "DevSecOps Masterclass",
    category: "DevSecOps",
    level: "Advanced",
    levelColor: "#e63757",
    duration: "60 Hours",
    lessons: "48 Lessons",
    badge: "New",
    badgeBg: "#6c57d2",
  },
  {
    icon: "fas fa-cloud",
    title: "Cloud Architecture on AWS & Azure",
    category: "Cloud Computing",
    level: "Intermediate",
    levelColor: "#ff792e",
    duration: "35 Hours",
    lessons: "28 Lessons",
    badge: null,
    badgeBg: null,
  },
  {
    icon: "fas fa-brain",
    title: "Machine Learning & MLOps",
    category: "AI & ML",
    level: "Advanced",
    levelColor: "#e63757",
    duration: "50 Hours",
    lessons: "40 Lessons",
    badge: "Bestseller",
    badgeBg: "#ff792e",
  },
  {
    icon: "fas fa-atom",
    title: "Quantum Computing Fundamentals",
    category: "Quantum Computing",
    level: "Beginner",
    levelColor: "#22c55e",
    duration: "25 Hours",
    lessons: "20 Lessons",
    badge: "New",
    badgeBg: "#6c57d2",
  },
  {
    icon: "fas fa-lock",
    title: "Enterprise Cybersecurity & Compliance",
    category: "Cybersecurity",
    level: "Intermediate",
    levelColor: "#ff792e",
    duration: "30 Hours",
    lessons: "24 Lessons",
    badge: null,
    badgeBg: null,
  },
];

const features = [
  {
    icon: "fas fa-user-tie",
    title: "Industry Expert Instructors",
    desc: "Real-world practitioners with 10+ years of enterprise deployment experience.",
  },
  {
    icon: "fas fa-laptop-code",
    title: "Hands-on Projects",
    desc: "Build real enterprise systems during the course — not toy examples.",
  },
  {
    icon: "fas fa-certificate",
    title: "Certificate of Completion",
    desc: "Industry-recognized certificates issued on successful course completion.",
  },
  {
    icon: "fas fa-users",
    title: "Enterprise Batch Training",
    desc: "Custom training programs for your entire team, delivered at your pace.",
  },
];

const TrainingPage = () => {
  return (
    <CustomLayout>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="lms-hero fix">
        <div className="lms-hero__bg" />
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="lms-hero__inner">
            <span className="lms-badge" data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
              <i className="fas fa-graduation-cap me-2"></i>Online Learning Platform
            </span>
            <h1
              className="lms-hero__title char-animation"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="900"
              data-aos-once="true"
            >
              Master Enterprise AI<br />& Cloud Technologies
            </h1>
            <p
              className="lms-hero__sub fade-in"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="900"
              data-aos-once="true"
            >
              Industry-led training programs designed for working professionals, IT teams,
              and enterprises. Learn AI, DevSecOps, Cloud, ERP and more.
            </p>
            <div
              className="lms-hero__btns"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="900"
              data-aos-once="true"
            >
              <a href="#courses" className="theme-btn">
                Browse Courses <i className="far fa-arrow-right"></i>
              </a>
              <Link to="/contact" className="theme-btn style-2">
                Enterprise Training <i className="far fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Course Categories ──────────────────────────────── */}
      <section className="section-padding lms-categories">
        <div className="container">
          <div className="section-title text-center mb-50">
            <span className="fade-in">Learning Paths</span>
            <h2 className="char-animation">Explore Our Training Programs</h2>
          </div>
          <div className="row g-4">
            {categories.map((cat, i) => (
              <div key={i} className="col-xl-4 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay={`${i * 80}`}
                data-aos-duration="800"
                data-aos-once="true"
              >
                <div className="lms-cat-card">
                  <div className="lms-cat-card__icon">
                    <i className={cat.icon}></i>
                  </div>
                  <div className="lms-cat-card__body">
                    <h4>{cat.name}</h4>
                    <p>{cat.courses} Courses</p>
                  </div>
                  <Link to="/contact" className="lms-cat-card__link">
                    View Courses <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ───────────────────────────────── */}
      <section id="courses" className="section-padding lms-courses">
        <div className="container">
          <div className="section-title text-center mb-50">
            <span className="fade-in">What We Offer</span>
            <h2 className="char-animation">Featured Courses</h2>
          </div>
          <div className="row g-4">
            {courses.map((course, i) => (
              <div key={i} className="col-xl-4 col-lg-6 col-md-6"
                data-aos="fade-up"
                data-aos-delay={`${i * 80}`}
                data-aos-duration="800"
                data-aos-once="true"
              >
                <div className="lms-course-card">
                  {course.badge && (
                    <span
                      className="lms-course-card__badge"
                      style={{ background: course.badgeBg! }}
                    >
                      {course.badge}
                    </span>
                  )}
                  <div className="lms-course-card__icon-wrap">
                    <i className={course.icon}></i>
                  </div>
                  <div className="lms-course-card__body">
                    <div className="lms-course-card__meta">
                      <span className="lms-course-card__cat">{course.category}</span>
                      <span
                        className="lms-course-card__level"
                        style={{ color: course.levelColor }}
                      >
                        {course.level}
                      </span>
                    </div>
                    <h3 className="lms-course-card__title">{course.title}</h3>
                    <p className="lms-course-card__instructor">
                      <i className="fas fa-chalkboard-teacher me-1"></i>
                      XERXEZ Expert Team
                    </p>
                  </div>
                  <div className="lms-course-card__footer">
                    <div className="lms-course-card__stats">
                      <span><i className="far fa-clock me-1"></i>{course.duration}</span>
                      <span><i className="fas fa-play-circle me-1"></i>{course.lessons}</span>
                    </div>
                    <Link to="/contact" className="lms-enroll-btn">
                      Enroll Now <i className="far fa-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose ─────────────────────────────────────── */}
      <section className="section-padding lms-why">
        <div className="container">
          <div className="section-title text-center mb-50">
            <span className="fade-in">Our Advantage</span>
            <h2 className="char-animation">Why Choose XERXEZ Training</h2>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-xl-3 col-lg-6 col-md-6"
                data-aos="fade-up"
                data-aos-delay={`${i * 100}`}
                data-aos-duration="800"
                data-aos-once="true"
              >
                <div className="lms-feature-card">
                  <div className="lms-feature-card__icon">
                    <i className={f.icon}></i>
                  </div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enterprise CTA ─────────────────────────────────── */}
      <section className="section-padding lms-enterprise-cta fix">
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="lms-enterprise-cta__inner text-center"
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-once="true"
          >
            <span className="lms-badge lms-badge--light mb-3">
              <i className="fas fa-building me-2"></i>For Organisations
            </span>
            <h2 className="text-white char-animation">Train Your Entire Team</h2>
            <p className="text-white opacity-75 mt-3 mb-4" style={{ maxWidth: 560, margin: "12px auto 28px" }}>
              Get custom enterprise training programs for your organisation.
              We come to you — on-site, virtual, or hybrid delivery.
            </p>
            <div className="lms-hero__btns justify-content-center">
              <Link to="/contact" className="theme-btn">
                Request Enterprise Training <i className="far fa-arrow-right"></i>
              </Link>
              <Link to="/contact" className="theme-btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}>
                Contact Us <i className="far fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </CustomLayout>
  );
};

export default TrainingPage;
