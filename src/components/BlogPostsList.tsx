import { useEffect, useState } from 'react';
import apiService from '@/services/api';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author_name: string;
  category_name: string;
  featured_image?: string;
  view_count: number;
  read_time: number;
  created_at: string;
}

export const BlogPostsList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getBlogPosts({ page });
      if (response.success) {
        setPosts(response.data);
        if (response.pagination) {
          setTotalPages(Math.ceil(response.pagination.count / response.pagination.page_size));
        }
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="blog-posts">
      <h2>Blog Posts</h2>
      <div className="posts-grid">
        {posts.map(post => (
          <article key={post.id} className="post-card">
            {post.featured_image && (
              <img src={post.featured_image} alt={post.title} />
            )}
            <h3>{post.title}</h3>
            <p className="excerpt">{post.excerpt}</p>
            <div className="meta">
              <span className="author">{post.author_name}</span>
              <span className="category">{post.category_name}</span>
              <span className="read-time">{post.read_time} min read</span>
              <span className="views">{post.view_count} views</span>
            </div>
            <small>{new Date(post.created_at).toLocaleDateString()}</small>
          </article>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogPostsList;
