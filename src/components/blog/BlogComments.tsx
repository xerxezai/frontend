import Image from "../utils/Image";

const BlogComments = () => {
  return (
    <div className="comments-section-wrap pt-40">
      <div className="comments-heading">
        <h3>03 Comments</h3>
      </div>

      <ul className="comments-item-list">
        <li
          className="single-comment-item"
          data-aos="fade-up"
          data-aos-delay="200" // stagger delay for each card
          data-aos-duration="1000" // smooth animation duration
          data-aos-easing="ease-out-cubic" // smooth easing
          data-aos-once="true"
        >
          <div className="author-img">
            <Image
              src="assets/img/news/author_img2.jpg"
              alt="img"
              width={140}
              height={140}
            />
          </div>
          <div className="author-info-comment">
            <div className="info">
              <h5>
                <a href="#">Rosalina Kelian</a>
              </h5>
              <span>19th May 2024</span>
              <a href="#" className="theme-btn minimal-btn">
                <i className="fal fa-reply"></i>Reply
              </a>
            </div>
            <div className="comment-text">
              <p>
                XERXEZ completely transformed how we manage our enterprise workflows.
                The AI-powered ERP integration was seamless and the team's support
                throughout the rollout was exceptional.
              </p>
            </div>
          </div>
        </li>

        <li
          className="single-comment-item"
          data-aos="fade-up"
          data-aos-delay="400" // stagger delay for each card
          data-aos-duration="1000" // smooth animation duration
          data-aos-easing="ease-out-cubic" // smooth easing
          data-aos-once="true"
        >
          <div className="author-img">
            <Image
              src="assets/img/news/author_img3.jpg"
              alt="img"
              width={100}
              height={100}
            />
          </div>
          <div className="author-info-comment">
            <div className="info">
              <h5>
                <a href="#">Arista Williamson</a>
              </h5>
              <span>21th Feb 2024</span>
              <a href="#" className="theme-btn minimal-btn">
                <i className="fal fa-reply"></i>Reply
              </a>
            </div>
            <div className="comment-text">
              <p>
                The DevSecOps pipeline XERXEZ built for us reduced our deployment
                time from days to hours while dramatically improving our security
                posture. Highly recommend their cloud consulting team.
              </p>
            </div>
          </div>
          <ul className="replay-comment">
            <li className="single-comment-item">
              <div className="author-img">
                <Image
                  src="assets/img/news/author_img4.jpg"
                  alt="img"
                  width={100}
                  height={100}
                />
              </div>
              <div className="author-info-comment">
                <div className="info">
                  <h5>
                    <a href="#">Salman Ahmed</a>
                  </h5>
                  <span>29th Jan 2021</span>
                  <a href="#" className="theme-btn minimal-btn">
                    <i className="fal fa-reply"></i>Reply
                  </a>
                </div>
                <div className="comment-text">
                  <p>
                    Completely agree â€” their MLOps expertise is second to none.
                    We've been running XERXEZ-built pipelines in production for
                    six months now with zero downtime.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default BlogComments;

