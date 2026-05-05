import { Link } from "react-router-dom";
import type { BlogDataType } from "../../types";

interface BlogPostsListProps {
  posts: BlogDataType[];
  isEmpty: boolean;
  onClearFilters: () => void;
  resetFunction: () => void;
  totalBlogComment?: number;
}

const BlogPostList = ({
  posts,
  isEmpty,
  onClearFilters,
  resetFunction,
  totalBlogComment = 0,
}: BlogPostsListProps) => {
  if (isEmpty) {
    return (
      <div className="blog-posts">
        <div className="single-blog-post">
          <div className="post-content text-center">
            <h3>No posts found</h3>
            <p>Try adjusting your search criteria or filters.</p>
            <button className="btn btn-primary mt-3" onClick={onClearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  const basePath = import.meta.env.VITE_APP_BASE_PATH;

  return (
    <div className="blog-posts">
      {posts.map((post, index) => (
        <div
          className="single-blog-post"
          key={post.id}
          data-aos="fade-up"
          data-aos-delay={index * 200} // stagger delay for each card
          data-aos-duration="1000" // smooth animation duration
          data-aos-easing="ease-out-cubic" // smooth easing
          data-aos-once="true"
        >
          <div
            className="post-featured-thumb"
            style={
              {
                "--post-image-url": `url('${basePath}${post.image}')`,
              } as React.CSSProperties
            }
          />
          <div className="post-content">
            <div className="post-meta">
              <span>
                <i className="far fa-user"></i>
                {post.author}
              </span>
              <span>
                <i className="fal fa-comments"></i>Comments (
                {post.comments.toString().padStart(2, "0")})
              </span>
              <span>
                <i className="fal fa-clock"></i>
                {post.readTime}
              </span>
            </div>
            <h3>
              <Link
                to={`/blog/${post.slug}`}
                role="button"
                onClick={resetFunction}
              >
                {post.title}
              </Link>
            </h3>
            <p>{post.content}</p>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Link
                to={`/blog/${post.slug}`}
                role="button"
                onClick={resetFunction}
                className="theme-btn mt-4"
              >
                READ DETAILS <i className="far fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="single-blog-post quote-post format-quote fade-in">
        <div className="post-content text-white bg-cover">
          <div className="quote-content">
            <div className="icon">
              <i className="fas fa-quote-left"></i>
            </div>
            <div className="quote-text">
              <h2>Excepteur sint occaecat cupida tat non proident, sunt in.</h2>
              <div className="post-meta">
                <span>
                  <i className="fal fa-comments"></i>
                  {totalBlogComment} Comments
                </span>
                <span>
                  <i className="fal fa-calendar-alt"></i>
                  {new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostList;
