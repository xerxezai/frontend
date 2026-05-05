import { Link } from "react-router-dom";
import { blogMainPosts } from "../../data";
import Image from "../utils/Image";

const BlogSection4 = () => {
  return (
    <section className="news-section-4 section-padding fix">
      <div className="container">
        <div className="section-title-area text-center text-lg-start">
          <div className="section-title">
            <span className="fade-in">Latest News & Articles</span>
            <h2 className="text-white char-animation">
              Stay Updated with Latest <br /> Blog Posts
            </h2>
          </div>

          <p className="text-white">
            Explore insights, trends, and tips on SEO and digital marketing from
            our experts. <br /> Get the knowledge you need to succeed.
          </p>
        </div>

        <div className="row">
          {blogMainPosts.slice(0, 3).map((post, index) => (
            <div className="col-xl-4 col-lg-6 col-md-6" key={post.id}>
              <div
                className={`news-box-items-4  ${
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
                <div className="news-images">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={416}
                    height={459}
                  />
                  <span className="post-date">
                    <i className="fas fa-calendar"></i>
                    {post.date}
                  </span>
                  <div className="news-content">
                    <span>
                      <i className="fas fa-comment-dots"></i>
                      <b>{post.comments}</b> COMMENTS
                    </span>
                    <h3>
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection4;
