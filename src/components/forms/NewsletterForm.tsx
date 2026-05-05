import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";

interface Props {
  style?: string;
}

// Constants
const ALERT_DURATION = 4000;
const SUBMISSION_DELAY = 2000;

const NewsletterForm = ({ style }: Props) => {
  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const email = inputRef.current?.value.trim() || "";

      // Clear previous alerts when submitting
      setAlert(null);

      // Validate email input
      if (!email) {
        setAlert({ type: "danger", message: "Email is required." });
        toast.error("Please enter your email.", { autoClose: ALERT_DURATION });
        inputRef.current?.focus();
        return;
      }

      if (!validateEmail(email)) {
        setAlert({
          type: "danger",
          message: "Please enter a valid email address.",
        });
        toast.error("Invalid email format.", { autoClose: ALERT_DURATION });
        inputRef.current?.focus();
        return;
      }

      // Simulate API request with a delay
      setIsSubmitting(true);
      setTimeout(() => {
        // Log the submitted email directly
        console.log("Submitted Email Address:", email);

        setIsSubmitting(false);
        setAlert({ type: "success", message: "You have been subscribed!" });
        toast.success("Subscribed successfully!", {
          autoClose: ALERT_DURATION,
        });

        // Clear the input field
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }, SUBMISSION_DELAY);
    },
    [validateEmail]
  );

  // Clear alerts when user starts typing (better UX)
  const handleInputChange = useCallback(() => {
    if (alert?.type === "danger") {
      setAlert(null);
    }
  }, [alert?.type]);

  return (
    <div role="region" aria-labelledby="newsletter-form-heading">
      <h2 id="newsletter-form-heading" className="visually-hidden">
        Newsletter Subscription Form
      </h2>

      <form
        onSubmit={handleSubmit}
        aria-describedby="newsletter-description"
        className={style === "style-3" ? "footer-input-4" : ""}
      >
        <div id="newsletter-description" className="visually-hidden">
          Enter your email to subscribe to our newsletter.
        </div>

        {style === "style-2" || style === "style-3" ? (
          <input
            ref={inputRef}
            type="email"
            name="email"
            id="email1"
            placeholder="Enter your email"
            className="form-control"
            aria-label="Email address"
            aria-required="true"
            aria-invalid={alert?.type === "danger"}
            disabled={isSubmitting}
            onChange={handleInputChange}
          />
        ) : (
          <div className="form-clt mb-2">
            <input
              ref={inputRef}
              type="email"
              name="email"
              id="email1"
              placeholder="Email Address"
              className="form-control"
              aria-label="Email address"
              aria-required="true"
              aria-invalid={alert?.type === "danger"}
              disabled={isSubmitting}
              onChange={handleInputChange}
            />
          </div>
        )}

        {style === "style-2" || style === "style-3" ? (
          <button
            type="submit"
            className={clsx(
              `${style === "style-2" ? "icon-btn" : "submit-btn"}`,
              {
                "is-pending": isSubmitting,
              }
            )}
            aria-label="Subscribe to newsletter"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              </>
            ) : (
              <>
                <i
                  className={
                    style === "style-2"
                      ? "fas fa-paper-plane"
                      : "fas fa-long-arrow-right"
                  }
                  aria-hidden="true"
                ></i>
              </>
            )}
          </button>
        ) : (
          <button
            type="submit"
            className={clsx("theme-btn", "w-100", {
              "is-pending": isSubmitting,
            })}
            aria-label="Subscribe to newsletter"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Submitting{" "}
                <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              </>
            ) : (
              <>
                Subscribe{" "}
                <i className="far fa-arrow-right" aria-hidden="true"></i>
              </>
            )}
          </button>
        )}

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

export default NewsletterForm;
