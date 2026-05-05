import { Link } from "react-router-dom";
import { blogMainPosts } from "../../data";
import Image from "../utils/Image";

const BlogSection3 = () => {
  return (
    <section className="news-section-3 section-padding fix section-bg-2">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our News</span>
          <h2 className="char-animation">
            Our Latest insight From Our <br /> Blog & News
          </h2>
        </div>

        <div className="row">
          {blogMainPosts.slice(0, 3).map((post, index) => (
            <div className="col-xl-4 col-lg-6 col-md-6" key={post.id}>
              <div
                className={`news-box-items style-2 ${
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
                    width={386}
                    height={349}
                  />
                </div>
                <div className="news-content">
                  <ul className="post-date">
                    <li>
                      <i className="far fa-calendar-star"></i>
                      {post.date}
                    </li>
                    <li>
                      <i className="far fa-comments"></i>
                      {post.comments} Comments
                    </li>
                  </ul>
                  <h3>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.content.slice(0, 81)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection3;
