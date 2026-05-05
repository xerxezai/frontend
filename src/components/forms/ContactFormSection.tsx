import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";

interface Props {
  variant?: boolean;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Constants
const ALERT_DURATION = 4000;
const SUBMISSION_DELAY = 2000;

const ContactFormSection = ({ variant }: Props) => {
  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactInfo, setIsContactInfo] = useState<ContactInfo>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
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
    (field: keyof ContactInfo, value: string) => {
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

  const focusField = useCallback((field: keyof ContactInfo) => {
    const element = document.getElementById(
      field === "email" ? "email2" : field
    );
    element?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const { name, email, phone, subject, message } = isContactInfo;

      // Trim all values
      const trimmedData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      };

      // Clear previous alerts when submitting
      setAlert(null);

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

      // Validate phone input
      if (!trimmedData.phone) {
        setAlert({ type: "danger", message: "Phone number is required." });
        toast.error("Please enter your phone number.", {
          autoClose: ALERT_DURATION,
        });
        focusField("phone");
        return;
      }

      // Validate subject input
      if (!trimmedData.subject) {
        setAlert({ type: "danger", message: "Subject is required." });
        toast.error("Please enter a subject.", { autoClose: ALERT_DURATION });
        focusField("subject");
        return;
      }

      if (trimmedData.subject.length < 3) {
        setAlert({
          type: "danger",
          message: "Subject must be at least 3 characters long.",
        });
        toast.error("Subject is too short.", { autoClose: ALERT_DURATION });
        focusField("subject");
        return;
      }

      // Validate message input
      if (!trimmedData.message) {
        setAlert({ type: "danger", message: "Message is required." });
        toast.error("Please enter your message.", {
          autoClose: ALERT_DURATION,
        });
        focusField("message");
        return;
      }

      if (trimmedData.message.length < 10) {
        setAlert({
          type: "danger",
          message: "Message must be at least 10 characters long.",
        });
        toast.error("Message is too short.", { autoClose: ALERT_DURATION });
        focusField("message");
        return;
      }

      // Simulate API request with a delay
      setIsSubmitting(true);
      setTimeout(() => {
        // Fixed: Properly log the submitted data as JSON
        console.log(
          "Submitted Contact Form Data:",
          JSON.stringify(trimmedData, null, 2)
        );

        setIsSubmitting(false);
        setAlert({
          type: "success",
          message: "Your message has been sent successfully!",
        });
        toast.success("Message sent successfully!", {
          autoClose: ALERT_DURATION,
        });

        // Clear all input fields
        setIsContactInfo({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, SUBMISSION_DELAY);
    },
    [isContactInfo, validateEmail, focusField]
  );

  return (
    <div role="region" aria-labelledby="contact-form-heading">
      <form
        className="contact-form-box fade-in"
        onSubmit={handleSubmit}
        aria-describedby="contact-form-description"
      >
        <div id="contact-form-description">
          Fill out this form to send us a message. All fields are required.
        </div>

        <div
          className={`row g-4 align-items-center ${
            variant ? "justify-content-center" : ""
          }`}
        >
          {" "}
          <div className="col-lg-6 col-md-6">
            <div className="form-clt">
              <input
                type="text"
                name="name"
                id="name"
                value={isContactInfo.name}
                placeholder="Name"
                aria-label="Full Name"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="form-clt">
              <input
                type="email"
                name="email"
                id="email2"
                value={isContactInfo.email}
                placeholder="Email address"
                aria-label="Email Address"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="form-clt">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={isContactInfo.phone}
                placeholder="Phone number"
                aria-label="Phone Number"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="form-clt">
              <input
                type="text"
                name="subject"
                id="subject"
                value={isContactInfo.subject}
                placeholder="Your subject"
                aria-label="Subject"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("subject", e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="form-clt">
              <textarea
                name="message"
                id="message"
                value={isContactInfo.message}
                placeholder="Write a message..."
                aria-label="Message"
                aria-required="true"
                aria-invalid={alert?.type === "danger"}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("message", e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className={variant ? "contact-button text-center" : ""}>
              <button
                type="submit"
                className={clsx("theme-btn", {
                  "is-pending": isSubmitting,
                })}
                aria-label="Send contact message"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    Sending{" "}
                    <i
                      className="fas fa-spinner fa-spin"
                      aria-hidden="true"
                    ></i>
                  </>
                ) : (
                  <>
                    {variant ? "Send Your Message" : "Contact Us"}
                    <i className="far fa-arrow-right" aria-hidden="true"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

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

export default ContactFormSection;
