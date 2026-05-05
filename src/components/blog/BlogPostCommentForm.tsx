import PostCommentForm from "../forms/PostCommentForm";

const BlogPostCommentForm = () => {
  return (
    <div className="comment-form-wrap d-block pt-5 fade-in">
      <h3>Post Comment</h3>
      <PostCommentForm />
    </div>
  );
};

export default BlogPostCommentForm;
