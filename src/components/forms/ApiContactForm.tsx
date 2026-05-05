/**
 * API-Integrated Contact Form Component
 * Submits contact form data to backend using soft-coded configuration
 */

import React, { useState } from 'react';
import { useSafeContactSubmit } from '../../hooks/useSafeApi';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

interface ContactFormProps {
  className?: string;
  showPhone?: boolean;
  onSubmitSuccess?: (data: ContactFormData) => void;
  onSubmitError?: (error: string) => void;
}

const ApiContactForm: React.FC<ContactFormProps> = ({
  className = "",
  showPhone = true,
  onSubmitSuccess,
  onSubmitError,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { submitContact, loading, error, success } = useSafeContactSubmit();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    if (showPhone && formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        phone: showPhone ? formData.phone?.trim() : undefined,
      });

      // Check hook state for success after submission
      if (success) {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          phone: '',
        });
        setValidationErrors({});
        
        if (onSubmitSuccess) {
          onSubmitSuccess(formData);
        }
      } else if (error) {
        if (onSubmitError) {
          onSubmitError(error);
        }
      }
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      if (onSubmitError) {
        onSubmitError(err.message || 'Failed to send message');
      }
    }
  };

  return (
    <div className={`contact-form-wrapper ${className}`}>
      <form onSubmit={handleSubmit} className="contact-form">
        {/* Success Message */}
        {success && (
          <div className="alert alert-success mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          {/* Name Field */}
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                placeholder="Full Name *"
                required
                disabled={loading}
              />
              {validationErrors.name && (
                <div className="invalid-feedback">
                  {validationErrors.name}
                </div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                placeholder="Email Address *"
                required
                disabled={loading}
              />
              {validationErrors.email && (
                <div className="invalid-feedback">
                  {validationErrors.email}
                </div>
              )}
            </div>
          </div>

          {/* Phone Field (optional) */}
          {showPhone && (
            <div className="col-md-6 mb-3">
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`}
                  placeholder="Phone Number"
                  disabled={loading}
                />
                {validationErrors.phone && (
                  <div className="invalid-feedback">
                    {validationErrors.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subject Field */}
          <div className={`col-md-${showPhone ? '6' : '12'} mb-3`}>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`form-control ${validationErrors.subject ? 'is-invalid' : ''}`}
                placeholder="Subject *"
                required
                disabled={loading}
              />
              {validationErrors.subject && (
                <div className="invalid-feedback">
                  {validationErrors.subject}
                </div>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div className="col-12 mb-3">
            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className={`form-control ${validationErrors.message ? 'is-invalid' : ''}`}
                placeholder="Your Message *"
                rows={5}
                required
                disabled={loading}
              ></textarea>
              {validationErrors.message && (
                <div className="invalid-feedback">
                  {validationErrors.message}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <button
              type="submit"
              className={`theme-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <i className="far fa-arrow-right"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* API Status Indicator */}
      <div className="api-status text-center mt-3">
        <small className="text-muted">
          <i className="fas fa-wifi text-success"></i> Connected to API
        </small>
      </div>
    </div>
  );
};

export default ApiContactForm;