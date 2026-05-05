import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";

interface CommentInfo {
  comment: string;
  name: string;
  email: string;
  website?: string; // Optional field
}

// Constants
const ALERT_DURATION = 4000;
const SUBMISSION_DELAY = 2000;

const PostCommentForm = () => {
  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactInfo, setIsContactInfo] = useState<CommentInfo>({
    comment: "",
    name: "",
    email: "",
    website: "",
  });

  // Effect hook to manage auto-dismissal of the custom alert div
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, ALERT_DURATION);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const validateEmail = useCallback((email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof CommentInfo, value: string) => {
      setIsContactInfo((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear alerts when user starts typing (better UX)
      if (alert?.type === "danger") {
        setAlert(null);
      }
    },
    [alert?.type]
  );

  const focusField = useCallback((field: keyof CommentInfo) => {
    const element = document.getElementById(
      field === "email"
        ? "email2"
        : field === "website"
        ? "website2"
        : field === "comment"
        ? "comment"
        : field
    );
    element?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const { comment, name, email, website } = isContactInfo;

      // Trim all values
      const trimmedData = {
        comment: comment.trim(),
        name: name.trim(),
        email: email.trim(),
        website: website?.trim() || "",
      };

      // Clear previous alerts when submitting
      setAlert(null);

      // Validate comment input
      if (!trimmedData.comment) {
        setAlert({ type: "danger", message: "Comment is required." });
        toast.error("Please enter your comment.", {
          autoClose: ALERT_DURATION,
        });
        focusField("comment");
        return;
      }

      if (trimmedData.comment.length < 10) {
        setAlert({
          type: "danger",
          message: "Comment must be at least 10 characters long.",
        });
        toast.error("Comment is too short.", { autoClose: ALERT_DURATION });
        focusField("comment");
        return;
      }

      // Validate name input
      if (!trimmedData.name) {
        setAlert({ type: "danger", message: "Name is required." });
        toast.error("Please enter your name.", { autoClose: ALERT_DURATION });
        focusField("name");
        return;
      }

      if (trimmedData.name.length < 2) {
        setAlert({
          type: "danger",
          message: "Name must be at least 2 characters long.",
        });
        toast.error("Name is too short.", { autoClose: ALERT_DURATION });
        focusField("name");
        return;
      }

      // Validate email input
      if (!trimmedData.email) {
        setAlert({ type: "danger", message: "Email address is required." });
        toast.error("Please enter your email address.", {
          autoClose: ALERT_DURATION,
        });
        focusField("email");
        return;
      }

      if (!validateEmail(trimmedData.email)) {
        setAlert({
          type: "danger",
          message: "Please enter a valid email address.",
        });
        toast.error("Invalid email format.", { autoClose: ALERT_DURATION });
        focusField("email");
        return;
      }

      // Simulate API request with a delay
      setIsSubmitting(true);
      setTimeout(() => {
        // Properly log the submitted data as JSON
        console.log(
          "Submitted Comment Form Data:",
          JSON.stringify(trimmedData, null, 2)
        );

        setIsSubmitting(false);
        setAlert({
          type: "success",
          message: "Your comment has been posted successfully!",
        });
        toast.success("Comment posted successfully!", {
          autoClose: ALERT_DURATION,
        });

        // Clear all input fields
        setIsContactInfo({
          comment: "",
          name: "",
          email: "",
          website: "",
        });
      }, SUBMISSION_DELAY);
    },
    [isContactInfo, validateEmail, focusField]
  );

  return (
    <div role="region" aria-labelledby="comment-form-heading">
      <h2 id="comment-form-heading" className="visually-hidden">
        Comment Form
      </h2>

      <form
        className="comment-form"
        onSubmit={handleSubmit}
        aria-describedby="comment-form-description"
      >
        <div id="comment-form-description" className="visually-hidden">
          Fill out this form to post a comment. Name, email, and comment are
          required.
        </div>

        <div className="single-form-input">
          <textarea
            name="comment"
            id="comment"
            value={isContactInfo.comment}
            placeholder="Type your comments...."
            aria-label="Comment"
            aria-required="true"
            aria-invalid={alert?.type === "danger"}
            disabled={isSubmitting}
            onChange={(e) => handleInputChange("comment", e.target.value)}
          />
        </div>

        <div className="single-form-input">
          <input
            type="text"
            placeholder="Type your name...."
            name="name"
            id="name"
            value={isContactInfo.name}
            aria-label="Full Name"
            aria-required="true"
            aria-invalid={alert?.type === "danger"}
            disabled={isSubmitting}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>

        <div className="single-form-input">
          <input
            type="email"
            name="email"
            id="email2"
            value={isContactInfo.email}
            placeholder="Type your email...."
            aria-label="Email Address"
            aria-required="true"
            aria-invalid={alert?.type === "danger"}
            disabled={isSubmitting}
            autoComplete="email"
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>

        <div className="single-form-input">
          <input
            type="text"
            name="website"
            id="website2"
            value={isContactInfo.website}
            placeholder="Type your website...."
            aria-label="Website (optional)"
            disabled={isSubmitting}
            onChange={(e) => handleInputChange("website", e.target.value)}
          />
        </div>

        <button
          className={clsx("theme-btn center", {
            "is-pending": isSubmitting,
          })}
          type="submit"
          aria-label="Post comment"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              Posting
            </>
          ) : (
            <span>
              <i className="fal fa-comments"></i>
              {" Post Comment"}
            </span>
          )}
        </button>

        {alert && (
          <div
            className={`alert alert-${alert.type} mt-3 flex items-center`}
            role="alert"
            aria-live="assertive"
          >
            {alert.type === "success" && (
              <i className="fas fa-check-circle me-2" aria-hidden="true"></i>
            )}
            {alert.type === "danger" && (
              <i className="fas fa-times-circle me-2" aria-hidden="true"></i>
            )}
            {alert.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default PostCommentForm;
