import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author_name: string;
  category_name: string;
  tag_names: string[];
  featured_image?: string;
  view_count: number;
  read_time: number;
  is_published: boolean;
  created_at: string;
}

interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
  is_approved: boolean;
  replies?: Comment[];
}

export const BlogPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await apiService.getBlogPost(parseInt(id!));
      if (response.success) {
        setPost(response.data as BlogPost);          // explicit cast: BlogDataType → BlogPost
        await apiService.get(`/blog/posts/${id}/increment_views/`);
      } else {
        setError(response.message ?? null);          // ?? null: undefined → null
      }
    } catch (err: any) {
      setError(err.message ?? null);                 // ?? null: undefined → null
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await apiService.get('/blog/comments/', { post_id: id });
      if (response.success) {
        setComments((response.data ?? []) as Comment[]);  // unknown → cast to Comment[]
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!post) return <div className="not-found">Post not found</div>;

  return (
    <article className="blog-post-detail">
      <header>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span className="author">{post.author_name}</span>
          <span className="date">{new Date(post.created_at).toLocaleDateString()}</span>
          <span className="read-time">{post.read_time} min read</span>
          <span className="views">{post.view_count} views</span>
        </div>
        <div className="post-tags">
          {post.tag_names?.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </header>

      {post.featured_image && (
        <figure>
          <img src={post.featured_image} alt={post.title} />
        </figure>
      )}

      <div className="content">
        {post.content}
      </div>

      <section className="comments">
        <h2>Comments ({comments.length})</h2>
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="comment">
                <strong>{comment.author_name}</strong>
                <p>{comment.content}</p>
                <small>{new Date(comment.created_at).toLocaleDateString()}</small>
                {comment.replies && comment.replies.length > 0 && (
                  <div className="replies">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="reply">
                        <strong>{reply.author_name}</strong>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </section>
    </article>
  );
};

export default BlogPostDetail;