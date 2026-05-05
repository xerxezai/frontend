import { Link } from "react-router-dom";
import type { BlogDataType } from "../../types";

interface RecentNewsWidgetProps {
  recentPosts: BlogDataType[];
}

const RecentNewsWidget = ({ recentPosts }: RecentNewsWidgetProps) => {
  const basePath = import.meta.env.VITE_APP_BASE_PATH;

  return (
    <div className="single-sidebar-widget">
      <div className="wid-title fade-in">
        <h3>Recent News</h3>
      </div>
      <div className="popular-posts fade-in">
        {recentPosts.map((post) => (
          <div key={`recent-${post.id}`} className="single-post-item">
            <div
              className="thumb bg-cover"
              style={
                {
                  "--post-thumb-url": `url('${basePath}${post.image}')`,
                } as React.CSSProperties
              }
            />
            <div className="post-content">
              <h5>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h5>
              <div className="post-date">
                <i className="far fa-calendar"></i>
                {post.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentNewsWidget;
