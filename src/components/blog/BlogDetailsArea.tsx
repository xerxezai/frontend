import type { BlogDataType } from "../../types";
import Image from "../utils/Image";
import BlogComments from "./BlogComments";
import BlogPostCommentForm from "./BlogPostCommentForm";

interface Props {
  blogInfo: BlogDataType;
}
const BlogDetailsArea = ({ blogInfo }: Props) => {
  return (
    <div className="blog-post-details border-wrap mt-0">
      <div className="single-blog-post post-details mt-0">
        <div className="post-content pt-0">
          <h2 className="mt-0 char-animation">
            {blogInfo.title}
          </h2>
          <div className="post-meta mt-3">
            <span>
              <i className="fal fa-user"></i>
              {blogInfo.author}
            </span>
            <span>
              <i className="fal fa-comments"></i>
              {blogInfo.comments} Comments
            </span>
            <span>
              <i className="fal fa-calendar-alt"></i>
              {blogInfo.date}
            </span>
          </div>
          <p>{blogInfo.content}</p>
          <p>
            With worldwide annual spend on digital advertising surpassing $325
            billion, it’s no surprise that different approaches to online
            marketing are becoming available. One of these new approaches is
            performance marketing or digital performance marketing. Keep reading
            to learn all about performance marketing, from how it works to how
            it compares to digital marketing. Plus, get insight into the
            benefits and risks of performance marketing and how it can affect
            your company’s long-term success and profitability.
          </p>
          <Image
            src={blogInfo.image}
            alt="blog__img"
            className="single-post-image fade-in"
            width={856}
            height={455}
          />
          <h2 className="mt-0 char-animation">
            You Should Experience Agency At Least Once In Your Lifetime And
            Here's Why.
          </h2>
          <p className="mt-2">
            Performance marketing is an approach to digital marketing or
            advertising where businesses only pay when a specific result occurs.
            This result could be a new lead, sale, or other outcome agreed upon
            by the advertiser and business. Performance marketing involves
            channels such as affiliate marketing, online advertising.
          </p>

          <blockquote>
            Diam luctus nostra dapibus varius et semper semper rutrum ad risus
            felis eros. Cursus libero viverra tempus netus diam vestibulum
          </blockquote>
          <p>
            With worldwide annual spend on digital advertising surpassing $325
            billion, it’s no surprise that different approaches to online
            marketing are becoming available. One of these new approaches is
            performance marketing or digital performance marketing. Keep reading
            to learn all about performance marketing
          </p>
          <ul className="checked-list mb-4">
            <li>Cooking is love made visible</li>
            <li>We’re an open book</li>
            <li>100% goes to the field</li>
            <li>Received the highest grades</li>
          </ul>
          <h4 className="char-animation">
            Easy & Most Powerful Server Platform.
          </h4>
          <p>
            With worldwide annual spend on digital advertising surpassing $325
            billion, it’s no surprise that different approaches to online
            marketing are becoming available. One of these new approaches is
            performance marketing or digital performance marketing. Keep reading
            to learn all about performance marketing, from how it works to how
            it compares to digital marketing. Plus, get insight into the
            benefits and risks of performance marketing and how it can affect
            your company’s long-term success and profitability.
          </p>
          <Image
            className="alignleft fade-in"
            src="assets/img/news/post-5.jpg"
            alt="blog__img"
            width={299}
            height={254}
          />
          <p>
            With worldwide annual spend on digital advertising surpassing $325
            billion, it’s no surprise that different approaches to online
            marketing are becoming available. One of these new approaches is
            performance marketing or digital performance marketing. Keep reading
            to learn all about performance marketing
          </p>
          <p>
            With worldwide annual spend on digital advertising surpassing $325
            billion, it’s no surprise that different approaches to online
            marketing are becoming available. One of these new approaches is
            performance marketing or digital performance marketing. Keep reading
            to learn all about performance marketing
          </p>
        </div>
      </div>

      <div className="row tag-share-wrap fade-in">
        <div className="col-lg-8 col-12">
          <h4>Related Tags</h4>
          <div className="tagcloud">
            {blogInfo.tags.map((tag) => (
              <a href="#" key={tag}>
                {tag}
              </a>
            ))}
          </div>
        </div>
        <div className="col-lg-4 col-12 mt-3 mt-lg-0 text-lg-end">
          <h4>Social Share</h4>
          <div className="social-share">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
      <BlogComments />
      <BlogPostCommentForm />
    </div>
  );
};

export default BlogDetailsArea;
