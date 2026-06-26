import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";

const courses = [
  {
    icon: "fas fa-brain",
    title: "Full Stack AI Development",
    category: "AI & ML",
    level: "Intermediate",
    levelColor: "#C9883A",
    duration: "60 Hours",
    lessons: "48 Lessons",
    badge: "Bestseller",
    badgeBg: "#C9883A",
  },
  {
    icon: "fas fa-shield-alt",
    title: "MLOps - Machine Learning Operations",
    category: "DevSecOps & AI",
    level: "Advanced",
    levelColor: "#e63757",
    duration: "50 Hours",
    lessons: "40 Lessons",
    badge: "New",
    badgeBg: "#C9883A",
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
          <div className="row align-items-center">
            {/* Left: text */}
            <div className="col-lg-6">
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
                  className="lms-hero__sub"
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
                  <Link to="/contact" className="theme-btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}>
                    Enterprise Training <i className="far fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: visual */}
            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div
                className="lms-hero__visual"
                data-aos="fade-left"
                data-aos-delay="200"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                <div className="lms-vis-orb lms-vis-orb--1" />
                <div className="lms-vis-orb lms-vis-orb--2" />
                <div className="lms-vis-card">
                  <div className="lms-vis-card__glow" />

                  {/* Top badge */}
                  <div className="lms-vis-pill">
                    <i className="fas fa-graduation-cap"></i>
                    <span>XERXEZ Training Platform</span>
                  </div>

                  {/* Stats row */}
                  <div className="lms-vis-stats">
                    <div className="lms-vis-stat">
                      <span className="lms-vis-stat__num">2</span>
                      <span className="lms-vis-stat__label">Courses</span>
                    </div>
                    <div className="lms-vis-stat">
                      <span className="lms-vis-stat__num">110h</span>
                      <span className="lms-vis-stat__label">Content</span>
                    </div>
                    <div className="lms-vis-stat">
                      <span className="lms-vis-stat__num">100%</span>
                      <span className="lms-vis-stat__label">Practical</span>
                    </div>
                  </div>

                  {/* Course progress rows */}
                  <div className="lms-vis-courses">
                    <div className="lms-vis-course">
                      <div className="lms-vis-course__head">
                        <div className="lms-vis-course__icon" style={{ background: "rgba(201,136,58,0.10)", color: "#C9883A" }}>
                          <i className="fas fa-brain"></i>
                        </div>
                        <div>
                          <p className="lms-vis-course__name">Full Stack AI Development</p>
                          <p className="lms-vis-course__meta">Intermediate · 60 Hours</p>
                        </div>
                        <span className="lms-vis-course__badge" style={{ background: "#C9883A" }}>Bestseller</span>
                      </div>
                      <div className="lms-vis-bar">
                        <div className="lms-vis-bar__fill" style={{ width: "72%", background: "linear-gradient(90deg,#C9883A,#E5B460)" }} />
                      </div>
                    </div>

                    <div className="lms-vis-course">
                      <div className="lms-vis-course__head">
                        <div className="lms-vis-course__icon" style={{ background: "rgba(230,55,87,0.15)", color: "#e63757" }}>
                          <i className="fas fa-shield-alt"></i>
                        </div>
                        <div>
                          <p className="lms-vis-course__name">MLOps - ML Operations</p>
                          <p className="lms-vis-course__meta">Advanced · 50 Hours</p>
                        </div>
                        <span className="lms-vis-course__badge" style={{ background: "#C9883A" }}>New</span>
                      </div>
                      <div className="lms-vis-bar">
                        <div className="lms-vis-bar__fill" style={{ width: "55%", background: "linear-gradient(90deg,#e63757,#ff6b8a)" }} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom tag */}
                  <div className="lms-vis-pill mt-3">
                    <i className="fas fa-certificate"></i>
                    <span>Certificate of Completion Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Courses ───────────────────────────────── */}
      <section id="courses" className="lms-section lms-courses">
        <div className="container">
          <div className="section-title text-center mb-40">
            <span className="fade-in">What We Offer</span>
            <h2 className="char-animation">Featured Courses</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {courses.map((course, i) => (
              <div key={i} className="col-xl-5 col-lg-6 col-md-10"
                data-aos="fade-up"
                data-aos-delay={`${i * 100}`}
                data-aos-duration="800"
                data-aos-once="true"
              >
                <div className="lms-course-card">
                  {course.badge && (
                    <span className="lms-course-card__badge" style={{ background: course.badgeBg! }}>
                      {course.badge}
                    </span>
                  )}
                  <div className="lms-course-card__icon-wrap">
                    <i className={course.icon}></i>
                  </div>
                  <div className="lms-course-card__body">
                    <div className="lms-course-card__meta">
                      <span className="lms-course-card__cat">{course.category}</span>
                      <span className="lms-course-card__level" style={{ color: course.levelColor }}>
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
      <section className="lms-section lms-why">
        <div className="container">
          <div className="section-title text-center mb-40">
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
      <section className="lms-section lms-enterprise-cta fix">
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

