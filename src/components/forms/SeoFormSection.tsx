import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";

interface Props {
  variant?: boolean;
}

interface SeoInfo {
  website: string;
  email: string;
}

// Constants
const ALERT_DURATION = 4000;
const SUBMISSION_DELAY = 2000;

const SeoFormSection = ({ variant }: Props) => {
  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeoInfo, setIsSeoInfo] = useState<SeoInfo>({
    website: "",
    email: "",
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

  const validateUrl = useCallback((url: string): boolean => {
    try {
      // Allow URLs with or without protocol
      const urlToValidate =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;
      new URL(urlToValidate);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleInputChange = useCallback(
    (field: keyof SeoInfo, value: string) => {
      setIsSeoInfo((prev) => ({
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

  const focusField = useCallback((field: keyof SeoInfo) => {
    const element = document.getElementById(field);
    element?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const { website, email } = isSeoInfo;

      // Trim all values
      const trimmedData = {
        website: website.trim(),
        email: email.trim(),
      };

      // Clear previous alerts when submitting
      setAlert(null);

      // Validate website URL input
      if (!trimmedData.website) {
        setAlert({ type: "danger", message: "Website URL is required." });
        toast.error("Please enter your website URL.", {
          autoClose: ALERT_DURATION,
        });
        focusField("website");
        return;
      }

      if (!validateUrl(trimmedData.website)) {
        setAlert({
          type: "danger",
          message: "Please enter a valid website URL.",
        });
        toast.error("Invalid website URL format.", {
          autoClose: ALERT_DURATION,
        });
        focusField("website");
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
        // Log the submitted data properly
        console.log(
          "Submitted SEO Form Data:",
          JSON.stringify(trimmedData, null, 2)
        );

        setIsSubmitting(false);
        setAlert({
          type: "success",
          message: "SEO analysis request submitted successfully!",
        });
        toast.success("SEO check initiated successfully!", {
          autoClose: ALERT_DURATION,
        });

        // Clear all input fields
        setIsSeoInfo({
          website: "",
          email: "",
        });
      }, SUBMISSION_DELAY);
    },
    [isSeoInfo, validateEmail, validateUrl, focusField]
  );

  return (
    <div 
      className="fade-in"
      role="region"
      aria-labelledby="seo-form-heading"
      style={{ position: "relative" }}
    >
      <h2 id="seo-form-heading" className="visually-hidden">
        SEO Analysis Form
      </h2>

      <form
        onSubmit={handleSubmit}
        aria-describedby="seo-form-description"
        className="overflow-visible"
      >
        <div id="seo-form-description" className="visually-hidden">
          Enter your website URL and email address to get SEO analysis.
        </div>

        {variant ? (
          <div className="input-item">
            <input
              type="text"
              id="website"
              value={isSeoInfo.website}
              placeholder="Website URL"
              aria-label="Website URL"
              aria-required="true"
              aria-invalid={alert?.type === "danger"}
              disabled={isSubmitting}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
            <input
              type="email"
              id="email"
              value={isSeoInfo.email}
              placeholder="Email Address"
              aria-label="Email Address"
              aria-required="true"
              aria-invalid={alert?.type === "danger"}
              disabled={isSubmitting}
              onChange={(e) => handleInputChange("email", e.target.value)}
              autoComplete="on"
            />
          </div>
        ) : (
          <>
            <div className="form-clt">
              <input
                type="text"
                name="website"
                id="website"
                value={isSeoInfo.website}
                placeholder="Website URL"
                aria-label="Website URL"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>
            <div className="form-clt">
              <input
                type="email"
                name="email"
                id="email"
                value={isSeoInfo.email}
                placeholder="Email Address"
                aria-label="Email Address"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("email", e.target.value)}
                autoComplete="on"
              />
            </div>
          </>
        )}

        <button
          className={clsx("theme-btn", {
            "is-pending": isSubmitting,
          })}
          type="submit"
          aria-label="Check SEO now"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              Checking{" "}
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
            </>
          ) : (
            <>
              Check Now
              <i className="far fa-arrow-right" aria-hidden="true"></i>
            </>
          )}
        </button>

        {alert && (
          <div
            className={
              `alert alert-${alert.type} flex items-center justify-center ` +
              `position-absolute top-100 start-0 w-100 mt-4 text-center`
            }
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

export default SeoFormSection;
