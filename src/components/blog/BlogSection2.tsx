import { Link } from "react-router-dom";
import { blogMainPosts } from "../../data";
import Image from "../utils/Image";

interface Props {
  variant?: boolean;
}

const BlogSection2 = ({ variant }: Props) => {
  return (
    <section
      className={`news-section-2 section-padding fix ${
        variant ? "section-bg-2" : "pt-0"
      }`}
    >
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our News</span>
          <h2 className="char-animation">Our Latest insight and Blog</h2>
        </div>

        <div className="row">
          {blogMainPosts.slice(0, 3).map((post, index) => (
            <div className="col-xl-4 col-lg-6 col-md-6" key={post.id}>
              <div
                className={`news-box-items-2 ${
                  index === 0
                    ? "item_right_1"
                    : index === 2
                    ? "item_left_1"
                    : ""
                }`}
                data-aos="fade-up"
                data-aos-delay={index * 200} // stagger delay for each card
                data-aos-duration="1000" // smooth animation duration
                data-aos-easing="ease-out-cubic" // smooth easing
                data-aos-once="true"
              >
                <div className="news-img">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={416}
                    height={381}
                  />
                </div>
                <div className="news-content">
                  <span className="data-list">
                    <i className="fas fa-calendar"></i>
                    {post.date}
                  </span>
                  <h3>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
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

export default BlogSection2;
